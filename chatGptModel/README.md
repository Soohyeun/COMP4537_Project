---
license: apache-2.0
---

To re-create and use the chatbot for inference, follow these steps:

1. Download the model artifacts from the Hugging Face Model Hub by following the instructions in the article.
2. Clone the [GitHub repository](https://github.com/arunprsh/multi-turn-chatbot-gpt-sagemaker) for the multi-turn chatbot with GPT-Neo and Sagemaker.
3. Navigate to the `03-evaluate` directory to access the notebook with the code for inference.

![Alt Text](https://github.com/arunprsh/multi-turn-chatbot-gpt-sagemaker/blob/main/img/mtc1.png?raw=true)

For a comprehensive, step-by-step guide on how to replicate the creation of a multi-turn chatbot using GPT-Neo, please refer to the Medium article [here](https://medium.com/@shankar.arunp/building-a-multi-turn-chatbot-with-gpt-and-sagemaker-a-step-by-step-guide-7d75f33ccea1).


##### Sample inference code:
```python
def chat():
    logger.info('[Entering chat session ...]')
    logger.info(f'To quit the conversation and reset memory, please type "{RESET_CMD}"')
    
    query_history = []
            
    while True:
        utterance = input('You: ')
        
        # Exit session if user types the RESET prompt
        if utterance == RESET_PROMPT:
            logger.info(f'[Exiting chat session]')
            break
            
        # Add speaker 1 id to start of query and encode it using the tokenizer
        input_ids = tokenizer.encode(utterance)
        input_ids = [speaker_1_id] + input_ids
        query_history.append(input_ids)
        
        if len(query_history) >= MAX_TURNS:
            num_exceeded = len(query_history) - MAX_TURNS
            query_history = query_history[num_exceeded:]
            
        # Add beginning of sequence and end of sequence ids to input_ids, and convert it to a tensor
        input_ids = [bos_id] + list(chain.from_iterable(query_history)) + [speaker_2_id]

        # Determine the speaker of the first turn based on the first speaker id
        start_sp_id = query_history[0][0]
        
        # Determine the speaker of the next turn
        next_sp_id = speaker_1_id if start_sp_id == speaker_2_id else speaker_2_id

        # Create token type ids for each turn based on the speaker of the turn
        token_type_ids = [[start_sp_id] * len(turn) if h % 2 == 0 else [next_sp_id] * len(turn) for h, turn in enumerate(query_history)]

        # Add beginning of sequence and end of sequence ids to token_type_ids, and convert it to a tensor
        token_type_ids = [start_sp_id] + list(chain.from_iterable(token_type_ids)) + [speaker_2_id]

        # Determine the length of the input_ids tensor
        input_len = len(input_ids)
        
        # Convert input_ids and token_type_ids to PyTorch tensors, add an extra dimension, and move to the device (GPU)
        input_ids = torch.LongTensor(input_ids).unsqueeze(0).to(device)
        token_type_ids = torch.LongTensor(token_type_ids).unsqueeze(0).to(device)  
        
        # generate a response from the model given some input
        output_ids = model.generate(input_ids=input_ids, 
                                    token_type_ids=token_type_ids, 
                                    pad_token_id=eos_id, 
                                    do_sample=True, 
                                    top_p=TOP_P, 
                                    max_length=MAX_LEN)
        
        # extract the generated sequence from the output and remove the input sequence
        output_ids = output_ids[0].tolist()[input_len:]
        
        # convert the generated sequence of token ids into text
        response = tokenizer.decode(output_ids, skip_special_tokens=True)
        print(f'Bot: {response}')
        
        # append the generated sequence to the query history as token ids
        query_history.append([speaker_2_id] + tokenizer.encode(response))    

```