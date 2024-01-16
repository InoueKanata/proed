import glob
from moviepy.editor import *
def movie(secS):
    file_list = glob.glob(folder_path+"\image*.png")
    # ファイル名リストを昇順にソート
    file_list.sort()
    # スライドショーを作る元となる静止画情報を格納する処理
    clips = [] 
    tmpMV=0
    for m in file_list:
        #img = Image.open(m)
        clip = ImageClip(m).set_duration(secS[tmpMV])
        clips.append(clip)
        tmpMV= tmpMV+1
    # スライドショーの動画像を作成する処理
    concat_clip = concatenate_videoclips(clips, method="compose")
    concat_clip.write_videofile(r"output.mp4", 
                                fps=24,
                                write_logfile=True,
                                )