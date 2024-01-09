from bardapi import Bard


def main(bardtoken,text):

    bard = Bard(token=bardtoken)
    prompt="以下のプロットには一部文章が抜けている部分が存在します。そのため、プロット内容を読み解き、このプロットを再生成してください。\n文章量は元のプロットと同程度だと良いです。\n回答には再生成後のプロットのみを表示し、それ以外を一切表示しないでください。\n以下プロットです。\n\n"+text
    response = bard.get_answer(prompt)['content']
    return response

# bardtoken =  "bAhYVunEH8yJ-D-VKL6Bo1Nv99hx-_xmRog7dTftjm0J2CGuUCsnKB4hcSz6wto9qd3hbA."
# tmp = main("C:\\Users\\tabiu\\Downloads\\prompt.txt")
# print(tmp)