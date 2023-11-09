import torch
from torch import autocast
from diffusers import StableDiffusionPipeline
import deepl
import os

#画像生成プログラム
prompt = "masterpiece, best quality, ((background only:2)),"
key=os.environ["DEEPL_AUTH_KEY"]
translator = deepl.Translator(key)
#txt="昼の商店街。八百屋の前。, シンプル, 線を少なく,単純, 線画, 背景"
txt="女性が一人いてそれを横からみた画像, シンプル, 線を少なく, 単純, 背景なし, 人"
tmp = translator.translate_text(txt, target_lang="EN-US").text
prompt = prompt + tmp
def create_background(prompt):
    hugging_token = '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'

    ldm = StableDiffusionPipeline.from_pretrained("CompVis/stable-diffusion-v1-4",revision="fp16",torch_dtype=torch.float16,use_auth_token=hugging_token).to("cuda")

    with autocast("cuda"):
        image = ldm(prompt,
                    #negative_prompt="sketches, painting, (character, person, human, people, hands, girl, man, :1.3), user name",
                    negative_prompt="sketches, painting, user name",
                    height=720,
                    width=1280,
                    guidance_scale=7.5,  # プロンプトの重み（生成画像の類似度（0〜20)）
                    num_inference_steps=50,  # 画像生成に費やすステップ数
                    ).images[0]

    image.save("image.png")

create_background(prompt=prompt)

