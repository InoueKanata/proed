import tkinter as tk
import tkinter.ttk as ttk
root = tk.Tk()
root.geometry('500x500')
tree = ttk.Treeview(root, column=('A','B'), selectmode='browse', height=10)
tree.grid(row=0, column=0, sticky='nsew')
tree.heading('#0', text='Pic directory', anchor='center')
tree.heading('#1', text='A', anchor='center')
tree.heading('#2', text='B', anchor='center')
tree.column('A', anchor='center', width=100)
tree.column('B', anchor='center', width=100)
img = tk.PhotoImage(file="9K.png")
tree.insert('', 'end', text="#0's text", image=img, value=("Something", "Another Thing"))
root.mainloop()