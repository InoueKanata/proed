#!/usr/bin/env python3.6
# -*- coding: utf-8 -*-

import glob
from moviepy.editor import *

if __name__ == '__main__':

    # inputディレクトリ以下の拡張子が.jpgのファイル名リストを一括取得
    file_list = glob.glob(r'picture/konte_cut*.jpg')
    # ファイル名リストを昇順にソート
    file_list.sort()

    # スライドショーを作る元となる静止画情報を格納する処理
    clips = [] 
    for m in file_list:
        clip = ImageClip(m).set_duration('00:00:01')
        clip = clip.resize(newsize=(1280,960))
        clips.append(clip)

    # スライドショーの動画像を作成する処理
    concat_clip = concatenate_videoclips(clips, method="compose")
    concat_clip.write_videofile(r"output.mp4", 
                                fps=24,
                                write_logfile=True,
                                )