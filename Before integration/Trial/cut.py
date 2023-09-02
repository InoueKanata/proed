from PIL import Image

im = Image.open('picture\konte1.JPG')
#(left, upper, right, lower)横の幅は固定。縦の幅は115
im.crop((158, 88, 381, 203)).save('picture\konte_cut1.JPG', quality=95)
im.crop((158, 203, 381, 318)).save('picture\konte_cut2.JPG', quality=95)
im.crop((158, 318, 381, 433)).save('picture\konte_cut3.JPG', quality=95)
im.crop((158, 433, 381, 548)).save('picture\konte_cut4.JPG', quality=95)