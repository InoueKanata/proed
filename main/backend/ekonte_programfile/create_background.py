import torch
from PIL import Image

#画像生成プログラム,引数prompt=ポジティブプロンプト,numP=画像につける識別用番号
#create_background(prompt,numP)→prompt=ポジティブプロンプト,numP何枚目の画像なのか.別画像として保存する際に使用)
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
#prompt = "masterpiece, best quality, ((background only:2)), 構図の指定, 物の指定, 背景の指定, 向きの指定"