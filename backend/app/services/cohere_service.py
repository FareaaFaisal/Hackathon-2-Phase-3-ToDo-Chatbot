import cohere
import os
from dotenv import load_dotenv

class CohereService:
    def __init__(self):
        load_dotenv()
        cohere_api_key = os.getenv("COHERE_API_KEY")
        if not cohere_api_key:
            raise ValueError("COHERE_API_KEY is not set in the environment variables.")
        self.co = cohere.Client(cohere_api_key)

    def generate_response(self, prompt: str) -> str:
        # This is a basic implementation. More sophisticated prompting,
        # conversation history, and tool calling logic will be handled by the agent.
        response = self.co.generate(
            model='command-r', # Using 'command-r' as a capable model, could be 'xlarge' or others.
            prompt=prompt,
            max_tokens=150,
            temperature=0.7,
            num_generations=1,
        )
        if response.generations:
            return response.generations[0].text
        return "I'm sorry, I couldn't generate a response."
        return "I'm sorry, I couldn't generate a response."
