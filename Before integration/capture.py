import glob
from gensim.models import KeyedVectors
import open_clip
import torch
from transformers import generation,AutoProcessor,AutoModelForCausalLM,BlipForConditionalGeneration,Blip2ForConditionalGeneration
from PIL import Image
# import accelerate
# import bitsandbytes as bnb

#画像から文字


image = "1230_13_2.png"

#各種モデル読み込み *時間がかかります
#GIT-large fine-tuned on COCO
git_processor_large_coco = AutoProcessor.from_pretrained("microsoft/git-large-coco")#processor
git_model_large_coco = AutoModelForCausalLM.from_pretrained("microsoft/git-large-coco")#model


#BLIP-large
blip_processor_large = AutoProcessor.from_pretrained("Salesforce/blip-image-captioning-large")
blip_model_large = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-large")

#CoCa(oepnAI CLIPを使ったもの)
coca_model, _, coca_transform = open_clip.create_model_and_transforms(
    model_name="coca_ViT-L-14",
    pretrained="mscoco_finetuned_laion2B-s13B-b90k"
)


#BLIP-2 OPT 6.7b
# blip2_processor_8_bit = AutoProcessor.from_pretrained("Salesforce/blip2-opt-6.7b")
# blip2_model_8_bit = Blip2ForConditionalGeneration.from_pretrained("Salesforce/blip2-opt-6.7b", device_map="auto", load_in_8bit=True)


#GPUがあるならGPUを使用する
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
# device = torch.device("cpu")
print(device)

git_model_large_coco.to(device)
blip_model_large.to(device)
coca_model.to(device)


#GenerativeImage2Text用
def generate_caption(processor,model,images):
    inputs = processor(images=image, return_tensors="pt").to(device)
    generated_ids = model.generate(pixel_values=inputs.pixel_values, max_length=50)
    generated_caption = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
    return generated_caption


#OpenClip用
def generate_caption_coca(model,preprocess,image):
    im = preprocess(image).unsqueeze(0).to(device)
    with torch.no_grad(), torch.autocast(device_type=device.type):
        generated = coca_model.generate(im, seq_len=20)
    return (
        open_clip.decode(generated[0].detach())
        .split("<end_of_text>")[0]
        .replace("<start_of_text>", "")
    )


#画像表示
image = Image.open(image)

#画像に対する説明
caption_git_large_coco = generate_caption(git_processor_large_coco,git_model_large_coco,image)
print("caption_git_large_coco:",end="")
print(caption_git_large_coco)

caption_blip_large = generate_caption(blip_processor_large,blip_model_large,image)
print("caption_blip_large:",end="")
print(caption_blip_large)

caption_coca = generate_caption_coca(coca_model,coca_transform,image)
print("caption_coca:",end=" ")
print(caption_coca)

# caption_blip2_8_bit = generate_caption(blip2_processor_8_bit, blip2_model_8_bit,image).strip()
# print("caption_blip2_8_bit:",end=" ")
# print(caption_blip2_8_bit)