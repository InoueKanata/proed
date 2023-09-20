import tkinter as tk
import tkinter.ttk as ttk
from PIL import Image

root = tk.Tk()
icons = {
    "folder": tk.PhotoImage(file="9k.png"),
    "file": tk.PhotoImage(file="resize1.png"),
}
root.geometry('500x500')
tree = ttk.Treeview(root, column=('A','B'), selectmode='browse', height=3)
tree.grid(row=0, column=0, sticky='nsew')
tree.heading('#0', text='Pic directory', anchor='center')
tree.heading('#1', text='A', anchor='center')
tree.heading('#2', text='B', anchor='center')
tree.column('A', anchor='center', width=100)
tree.column('B', anchor='center', width=100)
im = Image.open("9k.png")
back_im = im.copy()
back_im = back_im.resize((180, 110))
back_im.save('9k_resize.png', quality=95)
img = tk.PhotoImage(file='9k_resize.png')
tree.insert('', 'end', text="#0's text", value=("Something", "Another Thing"), image=icons["folder"])
tree.insert('', 'end', text="#0's text", value=("2Something", "2Another Thing"),image=icons["file"])
style = ttk.Style()
style.configure('Treeview', rowheight=120)
root.mainloop()