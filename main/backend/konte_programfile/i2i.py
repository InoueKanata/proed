import torch
from torch import autocast
from diffusers import StableDiffusionImg2ImgPipeline
from PIL import Image
import os
import deepl

def create_background():
    key=os.environ["DEEPL_AUTH_KEY"]
    translator = deepl.Translator(key)
    hugging_token = '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'
    prompt = '(Masterpiece, Best Quality: 1.1), (Sketch: 1.1), Simple, Line Drawing'
    negative_prompt='(worst quality, low quality:1.3), 1girl, solo, lowres, artist name, signature, watermark, low contrast,no people'
    ldm = StableDiffusionImg2ImgPipeline.from_pretrained("CompVis/stable-diffusion-v1-4",revision="fp16",torch_dtype=torch.float16,use_auth_token=hugging_token).to("cuda")
    with autocast("cuda"):
        init_image = Image.open(r"C:\ProgramFolder\branch\proed\main\backend\input.png").convert("RGB")
        init_image = init_image.resize((640, 320))  # 生成画像のサイズを指定
        image = ldm(prompt,
            image=init_image,  # 入力画像
            negative_prompt=negative_prompt,
            strength=0.75,  # 入力画像と生成画像の類似度（0〜1）
            #height= 320,#もとは320*640，8で割れる数のみ受け付け
            #width=640,#解像度をあげるとより具体的な画像が出力される?
            guidance_scale=7.5,  # プロンプトの重み（生成画像の類似度（0〜20)）
            num_inference_steps=50,  # 画像生成に費やすステップ数
            ).images[0]
    image.save(r"imageSD.png")
while(True):
    print("入力")
    a=input()
    if(a=="a"):
        {
            create_background()
        }