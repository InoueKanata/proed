import os
import sys
sys.path.append('C:\ProgramFolder\Bard-API\Bard\Lib\site-packages')
from bardapi import Bard


bard = Bard(token='ZwjZNpHZ3JgxxOGksFPHpSFN82Z8fWrvqRNqbfUIxxxm37JPMteumQzc_B7gv369b0iZFQ.')
prompt="LLMとはなんですか?"
response = bard.get_answer(prompt)['content']
print(response) 