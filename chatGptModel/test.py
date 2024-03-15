from transformers import AutoTokenizer, AutoModelForCausalLM
model_name = "Sharathhebbar24/chat_gpt2_dpo"
model = AutoModelForCausalLM.from_pretrained(model_name)
tokenizer = AutoTokenizer.from_pretrained(model_name)

def generate_text(prompt):
    inputs = tokenizer.encode(prompt, return_tensors='pt')
    outputs = model.generate(inputs, max_length=640, pad_token_id=tokenizer.eos_token_id)
    generated = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return generated[:generated.rfind(".")+1]


prompt = """
user: history of formula 1
"""
res = generate_text(prompt)
print(res)