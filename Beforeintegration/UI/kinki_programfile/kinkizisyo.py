#大まかな流れ
#文章整形　→　形態素解析　→　一単語ごとに辞書とすりあわせる（文章ベクトルを用いて類似度を検出）→1文章をすり合わせ終わったら平均値を出して基準値以上ならば配列に入れてGUIに出力

import csv
from gensim.models import KeyedVectors
import MeCab
from PIL import Image
import sys


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
    word2vec_model_path = 'enwiki_dbow\model.vec'
    word2vec_model = KeyedVectors.load_word2vec_format(word2vec_model_path, binary=False)

    with open("ekonte.csv",encoding="utf-8") as f:
        reader = csv.reader(f)
        value = 0.6 #類似度判定用の値
        tmp_array = []
        sentence_array = []
        for row in reader:
            for i in text_arr:
                similarity = word2vec_model.similarity(row[0],i)
                tmp_array.append(similarity)
                if sentence_array >= value:
                    sentence_array.append([row[1],row[2]])#概要、改善案
        avarage = sum(tmp_array)/len(tmp_array)
        if avarage >= value:
            return sentence_array
        else:
            pass

#filepathからTxt fileを読み込んでtokenize_mecabとkinki_dicを実行する
def main(file_path):
    sentence_array = []
    result = []
    with open(file_path,"r") as f:
        file_contentes = f.read()
    sentence = file_contentes.split('\n')
    for i in sentence:
        tmp = tokenize_mecab(i)
        sentence_array =  kinki_dic(tmp)
        if sentence_array:
            count = 1
            result.apnned([count,i,sentence_array[0],sentence_array[1]])#NO.、禁忌(文章)、概要、改善案
            count +=1
    return result

