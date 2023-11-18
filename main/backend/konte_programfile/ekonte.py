import tkinter as tk
from tkinter import filedialog
from tkinter import ttk
import subprocess
import csv
from PIL import Image
import torch
from torch import autocast
from diffusers import StableDiffusionPipeline
import docx
from docx import Document
from docx.shared import Inches
import os
import deepl
import glob
from moviepy.editor import *

import kinkizisyo
import Bard


key=os.environ["DEEPL_AUTH_KEY"]
translator = deepl.Translator(key)
#画像生成プログラム
hugging_token = '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'
ldm = StableDiffusionPipeline.from_pretrained("CompVis/stable-diffusion-v1-4",revision="fp16",torch_dtype=torch.float16,use_auth_token=hugging_token).to("cuda")
def create_background(prompt,numP):
    with autocast("cuda"):
        image = ldm(prompt,
                    negative_prompt="sketches, painting, (character, person, human, people, hands, girl, man, :1.3), user name",
                    height= 320,#もとは320*640，8で割れる数のみ受け付け
                    width=640,#解像度をあげるとより具体的な画像が出力される?
                    guidance_scale=10,  # プロンプトの重み（生成画像の類似度（0〜20)）
                    num_inference_steps=50,  # 画像生成に費やすステップ数,もとは50
                    ).images[0]
    image.save(r"imagefile\image"+ str(numP) +".png")