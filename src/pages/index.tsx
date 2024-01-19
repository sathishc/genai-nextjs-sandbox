import {
	Button,
	Flex,
	Link,
	Text,
	TextField,
	View,
  ScrollView,
	withAuthenticator,
} from '@aws-amplify/ui-react'
import { useEffect, useState } from 'react'



export default function Home() {
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState('')

  const callAPI = async () => {
    const apiResult = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ input: message })
    });
    const apiResponse = await apiResult.json()
    setResponse(apiResponse.completion)
  };

  const clearRespose = () => {
    setResponse("")
  };
  
  return (
    <View>
			<ScrollView width="80%" height="500px" backgroundColor="white" border="1px" borderColor="gray">
        {response}
      </ScrollView>
			<TextField
					width="80%"
					label="Ask a question and submit" labelHidden={true} 
					onChange={(e) => setMessage(e.target.value)}
				/>
			
      <Button onClick={callAPI}>Submit Query</Button>
			<Button onClick={clearRespose}>Clear Response</Button>
      
		</View>
    
    
  )
}
