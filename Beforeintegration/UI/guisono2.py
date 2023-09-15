import tkinter as tk
from tkinter import filedialog
from tkinter import ttk
import subprocess
import csv
from PIL import Image


# ウィンドウの作成
root = tk.Tk()
root.title("GUI")

# ウィンドウサイズを設定
root.geometry("800x400")  # 幅x高さ

# ウィンドウのサイズ変更を無効にする
root.resizable(width=False, height=False)
root.configure(bg="gray")

button_style_large = {
    "width": 20,
    "height": 10,
    "bg": "lightblue",
    "font": ("Arial", 10),
}

button_style_small = {
    "width": 15,
    "height": 2,
    "bg": "lightblue",
    "font": ("Arial", 10),
}







# 表のデータ
data = [("1", "禁忌1", "概要1", "改善案1"),
        ("2", "禁忌2", "概要2", "改善案2"),
        ("3", "禁忌3", "概要3", "改善案3")]

# メインメニュー画面を表示する関数
def show_main_menu():
    # 現在表示中のフレームを非表示にする
    if current_frame:
        current_frame.grid_remove()

    # メインメニューフレームを作成
    main_menu_frame.grid(row=0, column=0)

# "禁忌チェック"ボタンがクリックされたときの処理
def button1_click():
    global current_frame
    current_frame = check_forbidden_frame

    # メインメニューフレームを非表示にし、禁忌チェック画面を表示
    main_menu_frame.grid_remove()
    check_forbidden_frame.grid(row=0, column=0)

# "ビデオコンテ作成"ボタンがクリックされたときの処理
def button2_click():
    global current_frame
    current_frame = video_create_frame

    # メインメニューフレームを非表示にし、ビデオコンテ作成画面を表示
    main_menu_frame.grid_remove()
    video_create_frame.grid(row=0, column=0)

# "root画面に戻る"ボタンがクリックされたときの処理
def back_to_main_menu():
    global current_frame
    current_frame = main_menu_frame

    # 他のフレームを非表示にし、メインメニューフレームを表示
    check_forbidden_frame.grid_remove()
    video_create_frame.grid_remove()
    data_frame.grid_remove()
    video_data_frame.grid_remove()
    main_menu_frame.grid(row=0, column=0)

def select_file(path):
    file_path = filedialog.askopenfilename(title=path)
    if file_path:
        if path == "ファイルを選択":
            file_path_text.delete(1.0, tk.END)  # テキストボックスをクリア
            file_path_text.insert(tk.END, file_path)
        elif path == "WORDファイル選択":
            file_path_text1.delete(1.0, tk.END)  # テキストボックスをクリア
            file_path_text1.insert(tk.END, file_path)



def execute_action():
    # テキストボックスからファイルパスを取得して禁忌辞書とすり合わせるプログラムを実行
    # result_data = subprocess.run(["python", ""], capture_output=True, text=True)
    # データを表示するウィンドウを呼び出す
    global current_frame
    current_frame = data_frame

    # 他のフレームを非表示にし、表を表示させる画面を表示
    check_forbidden_frame.grid_remove()
    video_create_frame.grid_remove()
    data_frame.grid(row=0, column=0)

def execute_action2():
    # Wordfile内の文字を読み取り、表として表示する
    # result_data = subprocess.run(["python", ""], capture_output=True, text=True)

    # データを表示するウィンドウを呼び出す
    global current_frame
    current_frame = data_frame

    # 他のフレームを非表示にし、表を表示させる画面を表示
    check_forbidden_frame.grid_remove()
    video_create_frame.grid_remove()
    video_data_frame.grid(row=0, column=0)


def regenerate_action():
    # subprocess.run(["python", ""], check=True) #プロット再生成のプログラムを実行
    back_to_main_menu()

def exportDocx():
    
    back_to_main_menu()



# メインメニューフレーム
main_menu_frame = tk.Frame(root, bg="gray")
main_menu_frame.grid(row=0, column=0)

button1 = tk.Button(main_menu_frame, text="禁忌チェック", command=button1_click, **button_style_large)
button1.grid(row=0, column=0, padx=100, pady=100)

button2 = tk.Button(main_menu_frame, text="ビデオコンテ作成", command=button2_click, **button_style_large)
button2.grid(row=0, column=1, padx=100, pady=100)

# 禁忌チェック画面
check_forbidden_frame = tk.Frame(root, bg="gray")

button_back = tk.Button(check_forbidden_frame, text="メイン画面に戻る", command=back_to_main_menu, **button_style_small)
button_back.grid(row=0, column=0, padx=5, pady=5)

button_select_file = tk.Button(check_forbidden_frame, text="ファイルを選択", command=lambda:select_file("ファイルを選択"), **button_style_large)
button_select_file.grid(row=1, column=1, padx=200, pady=20)

# テキストボックスを作成
file_path_text = tk.Text(check_forbidden_frame, height=1, width=40, bg="lightgray")
file_path_text.grid(row=2, column=1, padx=10, pady=0)

execute_button1 = tk.Button(check_forbidden_frame, text="実行", command=execute_action, **button_style_small)
execute_button1.grid(row=3, column=1, padx=0, pady=0)


# 表を表示(激うまギャグ)フレーム
data_frame = tk.Frame(root, bg="gray")

# データを表示するためのテーブル（Treeview）を作成
DataFlame_style1 = ttk.Style()
DataFlame_style1.configure('CustomStyle1.Treeview')

columns = ("No.", "禁忌", "概要", "改善案")
tree = ttk.Treeview(data_frame, columns=columns, show="headings",style='CustomStyle1.Treeview')

# テーブルの各列にヘッダーを設定
for col in columns:
    tree.heading(col, text=col)
    tree.column(col, width=100)  # 列の幅を調整

# データをテーブルに追加
for item in data:
    tree.insert("", "end", values=item)

# テーブルをフレームに配置
tree.pack(side="top", fill="both", expand=True)
tree.grid(row=1, column=0, padx=200, pady=10)

button_back3 = tk.Button(data_frame, text="メイン画面に戻る", command=back_to_main_menu, **button_style_small)
button_back3.grid(row=0, column=0, padx=5, pady=5,sticky="w")

submit_button = tk.Button(data_frame, text="再生成&ダウンロード",command=regenerate_action,**button_style_small)
submit_button.grid(row=2, column=0, padx=5, pady=5)

# ビデオコンテファイル選択画面
video_create_frame = tk.Frame(root, bg="gray")

button_back2 = tk.Button(video_create_frame, text="メイン画面に戻る", command=back_to_main_menu, **button_style_small)
button_back2.grid(row=0, column=0, padx=5, pady=5)

button_select_video = tk.Button(video_create_frame, text="WORDファイル選択",command=lambda:select_file("WORDファイル選択"), **button_style_large)
button_select_video.grid(row=1, column=1, padx=200, pady=20)

# テキストボックスを作成
file_path_text1 = tk.Text(video_create_frame, height=1, width=40, bg="lightgray")
file_path_text1.grid(row=2, column=1, padx=10, pady=0)

execute_button2 = tk.Button(video_create_frame, text="実行",command=execute_action2,**button_style_small)
execute_button2.grid(row=3, column=1, padx=0, pady=0)

#ビデオ・画像生成用の表を表示する画面
video_data_frame  = tk.Frame(root, bg="gray")

button_back3 = tk.Button(video_data_frame, text="メイン画面に戻る", command=back_to_main_menu, **button_style_small)
button_back3.grid(row=0, column=0, padx=5, pady=5,sticky="w")

button_back3 = tk.Button(video_data_frame, text="選択生成", **button_style_small)
button_back3.grid(row=0, column=0, padx=(0,225), pady=5)

button_back3 = tk.Button(video_data_frame, text="全生成",**button_style_small)
button_back3.grid(row=0, column=0, padx=(225,0), pady=5)

button_back3 = tk.Button(video_data_frame, text="完了",command=exportDocx,**button_style_small)
button_back3.grid(row=0, column=0, padx=0, pady=0,sticky="e")

#treeView
DataFlame_style2 = ttk.Style()
DataFlame_style2.configure('CustomStyle2.Treeview', rowheight=120)
tree1 = ttk.Treeview(video_data_frame, column=('A','B'), selectmode='browse', height=10,style='CustomStyle2.Treeview')

# 垂直スクロールバー
vsb = ttk.Scrollbar(video_data_frame, orient="vertical", command=tree1.yview)
vsb.grid(row=1, column=1, sticky="ns")
tree1.configure(yscrollcommand=vsb.set)
tree1.grid(row=1, column=0, padx=0, pady=0, sticky='nsew')


tree1.heading('#0', text='Pic directory', anchor='center')
tree1.heading('#1', text='A', anchor='center')
tree1.heading('#2', text='B', anchor='center')
tree1.column('A', anchor='center', width=290)
tree1.column('B', anchor='center', width=290)
im = Image.open("9k.png")
back_im = im.copy()
back_im = back_im.resize((180, 110))
back_im.save('9k_resize.png', quality=95)
img = tk.PhotoImage(file='9k_resize.png')
tree1.insert('', 'end', text="#0's text", image=img, value=("Something", "Another Thing"))
tree1.insert('', 'end', text="#0's text", image=img, value=("2Something", "2Another Thing"))

tree.grid_rowconfigure(0, weight=1)
tree.grid_columnconfigure(0, weight=1)

# イベントループを開始
current_frame = main_menu_frame
root.mainloop()
