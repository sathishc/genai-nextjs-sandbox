import {
  BedrockRuntimeClient,
  InvokeModelCommand
} from '@aws-sdk/client-bedrock-runtime';

import {
  STSClient,
  AssumeRoleCommand,
} from '@aws-sdk/client-sts';

import { Amplify, withSSRContext } from 'aws-amplify';
import type { NextApiRequest, NextApiResponse } from 'next';
import awsExports from '@/aws-exports';

Amplify.configure({
  ...awsExports,
  ssr: true
});

const crossAccountRole=process.env.X_ACCOUNT_ROLE;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = JSON.parse(req.body);
  const SSR = withSSRContext({ req });
  const credentials = await SSR.Auth.currentCredentials();

  const stsClient = new STSClient({
    region: 'us-east-1', 
    credentials,
  });
  const command = new AssumeRoleCommand(
    {
      RoleArn: crossAccountRole,
      RoleSessionName:"SessName"
    });
  const assumeResponse = await stsClient.send(command);
  
  const newCreds = {
    accessKeyId: assumeResponse.Credentials?.AccessKeyId as string,
    secretAccessKey: assumeResponse.Credentials?.SecretAccessKey as string,
    sessionToken: assumeResponse.Credentials?.SessionToken as string,
  }

  console.log("Creds passed ", newCreds);  

  const bedrock = new BedrockRuntimeClient({
    serviceId: 'bedrock',
    region: 'us-east-1',
    credentials:newCreds
  });
  

  // Anthropic's Claude model expects a chat-like string
  // of 'Human:' and 'Assistant:' responses separated by line breaks.
  // You should always end your prompt with 'Assistant:' and Claude
  // will respond. There are various prompt engineering techniques
  // and frameworks like LangChain you can use here too.
  const prompt = `Human:${body.input}\n\nAssistant:`;

  const result = await bedrock.send(
    new InvokeModelCommand({
      modelId: 'anthropic.claude-v2',
      contentType: 'application/json',
      accept: '*/*',
      body: JSON.stringify({
        prompt,
        // LLM costs are measured by Tokens, which are roughly equivalent
        // to 1 word. This option allows you to set the maximum amount of
        // tokens to return
        max_tokens_to_sample: 2000,
        // Temperature (1-0) is how 'creative' the LLM should be in its response
        // 1: deterministic, prone to repeating
        // 0: creative, prone to hallucinations
        temperature: 1,
        top_k: 250,
        top_p: 0.99,
        // This tells the model when to stop its response. LLMs
        // generally have a chat-like string of Human and Assistant message
        // This says stop when the Assistant (Claude) is done and expects
        // the human to respond
        stop_sequences: ['\n\nHuman:'],
        anthropic_version: 'bedrock-2023-05-31'
      })
    })
  );

  const stringResult = new TextDecoder().decode(result.body);
  console.log("Result is ", stringResult)

  // The response is a Uint8Array of a stringified JSON blob
  // so you need to first decode the Uint8Array to a string
  // then parse the string.
  res.status(200).json(JSON.parse(stringResult));
}