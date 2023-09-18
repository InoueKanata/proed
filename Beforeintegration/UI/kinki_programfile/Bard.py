from bardapi import Bard

def main(Bardtoken):
    bard = Bard(token=Bardtoken)
    prompt="LLMとはなんですか?"
    response = bard.get_answer(prompt)['content']
    return response