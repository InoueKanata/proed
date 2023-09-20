import torch
from torch import autocast
from diffusers import StableDiffusionPipeline

#画像生成プログラム

def create_background(prompt):
    hugging_token = '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'

    ldm = StableDiffusionPipeline.from_pretrained("CompVis/stable-diffusion-v1-4",revision="fp16",torch_dtype=torch.float16,use_auth_token=hugging_token).to("cuda")

    with autocast("cuda"):
        image = ldm(prompt,
                    negative_prompt="sketches, painting, (character, person, human, people, hands, girl, man, :1.3), user name",
                    height=360,
                    width=640,
                    guidance_scale=7.5,  # プロンプトの重み（生成画像の類似度（0〜20)）
                    num_inference_steps=50,  # 画像生成に費やすステップ数
                    ).images[0]

    image.save("image.png")

prompt = "masterpiece, best quality, ((background only:2)), 構図の指定, 物の指定, 背景の指定, 向きの指定" #例 prompt - negative_prompt

create_background(prompt=prompt)

