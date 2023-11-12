#大まかな流れ
#文章整形　→　形態素解析　→　一単語ごとに辞書とすりあわせる（文章ベクトルを用いて類似度を検出）→1文章をすり合わせ終わったら平均値を出して基準値以上ならば配列に入れてGUIに出力
import os
import csv
from gensim.models import KeyedVectors
import MeCab
from PIL import Image
import sys


# 2つ上のディレクトリパスを計算
main_directory_path = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
# c:\Users\tabiu\Downloads\proed\main

word2vec_model_path = os.path.join(main_directory_path,'\backend\kinki_programfile\model.vec')
word2vec_model = KeyedVectors.load_word2vec_format(word2vec_model_path, binary=False)

#「名詞」「動詞」「形容詞」のみの文章に整形する。入力はString 出力はStr array
def tokenize_mecab(text):
    formed_array = []
    wakati = MeCab.Tagger()
    tmp =  wakati.parse(text).replace("\t",",").split("\n")
    for i in tmp:
        i = i.split(",")
        if i[0] == "EOS":
            break
        if i[1] == "名詞" or i[1] =="動詞" or i[1] =="形容詞":
            formed_array.append(i[0])
    return formed_array

#辞書とのすり合わせ。入力はStr array 出力は
def kinki_dic(text_arr):
    #word2vecモデルのファイルパス読み込み

    kinkizisyo_path = os.path.join(main_directory_path,'\backend\kinki_programfile\kinkizisyo.csv')
    with open("kinki_programfile\\kinkzisyo.csv",encoding="utf-8") as f:
        reader = csv.reader(f)
        value = 0.6 #類似度判定用の値
        tmp_array = []
        sentence_array = []
        for row in reader:
            for i in text_arr:
                try:
                  similarity = word2vec_model.similarity(row[0],i)
                except KeyError:
                    pass
                if similarity >= value:
                    sentence_array.append([row[0],row[1],row[2]])#概要、改善案
                    tmp_array.append(i)
        return sentence_array,tmp_array

#filepathからTxt fileを読み込んでtokenize_mecabとkinki_dicを実行する
def main(file_path):
    sentence_array = []
    result = []
    count = 1
    with open(file_path,"r",encoding="utf-8") as f:
        file_contentes = f.read()
    sentence = file_contentes.split('\n')
    for i in sentence:
        tmp = tokenize_mecab(i)
        sentence_array,tmp_array =  kinki_dic(tmp)
        if sentence_array:
            result.append([count,sentence_array[0][0],sentence_array[0][1],sentence_array[0][2]])#NO.、禁忌(文章)、概要、改善案
            count +=1
    for i in tmp_array:
        file_contentes = file_contentes.replace(i,"")
    print(result)
    return result,file_contentes


