import ekonte
import csv
#変数定義

#辞書読み取り

sentence = ""
country = "japan"
sim_threshold = 0.7 #辞書と単語の類似度のしきい値　0~1　

sentence_mecab = ekonte.tokenize_mecab(sentence)#整形

def plot_remake(sentence,regulation):

    return text

with open(country+".csv") as f:
    reader = csv.reader(f)    #放送禁止用語の読み取り
    for i in reader:
        if i in set(sentence_mecab):
            plot_remake(sentence,reader)
            break
    for i in reader:#禁忌リスト
        for j in sentence_mecab:#整形済みの文章
            sim =  ekonte.text_similality(i,j)#類似度
            if sim >= sim_threshold:#類似度が一定以上でプロット再構築
                plot_remake(sentence,reader)
                break
        else:
            continue
        break
    
    

