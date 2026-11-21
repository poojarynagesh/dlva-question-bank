(function () {
  const R = String.raw;
  (window.QB_CONCEPTS = window.QB_CONCEPTS || {})["L17"] = [
    { h: R`The VLM story so far: each model fixes the last`, t: "def", b: R`<table><tr><th>Model</th><th>Idea</th><th>Drawback</th></tr>
<tr><td>CLIP</td><td>image + text encoders, contrastive loss; fusion only at the final dot product</td><td>late fusion; noisy web data; no generation</td></tr>
<tr><td>BLIP</td><td>ITC + ITM + LM modules, fusion inside via cross-attention; CapFilt cleans noisy captions; classifies and generates</td><td>trained end-to-end, costly (days)</td></tr>
<tr><td>BLIP-2</td><td>frozen image encoder + frozen LLM bridged by a <strong>Q-Former</strong></td><td>one image at a time</td></tr>
<tr><td>Flamingo</td><td>Perceiver Resampler + gated cross-attention, many images</td><td>image is still injected <em>inside</em> the language stream (cumbersome)</td></tr></table>
<p>LLaVA's insight: stop injecting vision inside the model; make image vectors ordinary <strong>input tokens</strong> of the LLM.</p>` },
    { h: R`Attention: two independent axes (the professor's key clarification)`, t: "exam", b: R`$$\text{Attention}(Q,K,V)=\text{softmax}\!\Bigl(\tfrac{QK^\top}{\sqrt{d_k}}+M\Bigr)V$$
<ul>
<li><strong>Axis 1 (masking direction):</strong> <em>bidirectional</em> (look forward and back; BERT/MLM) vs <em>causal</em> (look back only; GPT). In causal attention $M$ puts $-\infty$ on future positions so their softmax weight is $0$.</li>
<li><strong>Axis 2 (source of K,V):</strong> <em>self</em> (Q, K, V from the same sequence) vs <em>cross</em> (Q from one sequence, K,V from another, e.g. decoder attending to encoder output, English vs French).</li>
</ul>
<p>Hence $2\times2=4$ variants. <strong>Cross-attention is not a third category</strong> next to bidirectional/causal; a student made exactly this mistake. Bidirectionality gives better context, <em>not</em> the ability to generate; generation needs the causal mask.</p>
<table><tr><th>Model</th><th>Part</th><th>Objective</th></tr>
<tr><td>BERT</td><td>encoder only</td><td>masked LM ("A dog ___ in the grass")</td></tr>
<tr><td>GPT</td><td>decoder only</td><td>next-token prediction</td></tr>
<tr><td>T5</td><td>encoder + decoder</td><td>text-to-text; cross-attention encoder to decoder</td></tr></table>
<p>Self-attention example from class: "The animal didn't cross the street because it was too tired": the weight from "it" to "animal" is high. Multi-head: different heads learn different relations (e.g. syntax vs semantics).</p>` },
    { h: R`Teacher forcing vs autoregressive generation`, t: "def", b: R`<ul>
<li><strong>Training (teacher forcing):</strong> the ground-truth sequence, shifted right, is fed to the decoder, which predicts all next tokens in parallel. Stabilises and speeds up learning.</li>
<li><strong>Inference (autoregressive):</strong> no ground truth. Generate one token, shift it right, feed it back, repeat until the stop token.</li>
</ul>
<p>The "autoregressive loss" is just the ordinary language-modelling (next-token cross-entropy) loss. A VLM/LLM is several transformer components chained, not one block. Example: T5 sentiment on "I am doing good": sentence to encoder, label (shifted) to decoder at training time.</p>` },
    { h: R`LLaVA architecture and the one key idea`, t: "exam", b: R`<p>Three parts: <strong>vision encoder</strong> (CLIP ViT, frozen) giving $Z_v$; <strong>projection layer $W$</strong> giving $H_v$; <strong>language model</strong> (Vicuna, LLaMA-based) taking $[H_v;H_q]$ and generating text $X_a$.</p>
<ul>
<li>Uses the <strong>patch vectors, not the CLS token</strong>. For a CLIP ViT with $14$-pixel patches on a $336\times336$ image: $24\times24=576$ visual tokens (the class quoted ~576; token count is a heuristic chosen by trying a few values).</li>
<li>$W$ aligns the possibly out-of-distribution CLIP features to the language embedding space. $H_v$ are <strong>aligned vectors, not word embeddings</strong>.</li>
<li>Image and text tokens are <strong>concatenated</strong>; the LLM does plain (causal) self-attention over them and cannot tell which came from where. <strong>No cross-attention / fusion module.</strong></li>
<li>Same recipe works for audio, video, ... : swap the encoder, keep projection + LLM.</li>
<li>"2B/13B" conventionally means the <em>LLM backbone</em> size.</li>
</ul>
<p><strong>Prompt format:</strong> system message, then <code>USER: &lt;image tokens&gt; question</code>, then <code>ASSISTANT:</code> + generated answer. Images come <em>before</em> the question so causal attention lets the text look back at the image. The system prompt comes first and shapes perception of the image (financial vs psychology prompt interpret the same picture differently).</p>` },
    { h: R`Instruction data: GPT-4 + COCO`, b: R`<p>In 2023 there was almost no instruction-style image data, so LLaVA's was <strong>synthesised</strong>: COCO images with captions and bounding boxes (text annotations, given to GPT-4) produce ~150K samples of three kinds:</p>
<ol>
<li><strong>Conversation</strong>: "What is the dog doing?" gives "chasing a red ball across the grass".</li>
<li><strong>Detailed description</strong>: a rich caption of the same picture.</li>
<li><strong>Complex reasoning</strong>: "Why might the dog be running so fast?" The answer is not in the pixels; it uses GPT-4's world knowledge (playing fetch, excited, ...).</li>
</ol>
<p>Three kinds, so the model can follow instructions, reason <em>and</em> describe, instead of only classifying or producing one-line captions.</p>
<p>Motivation (professor's "reverse engineering" remark): GPT-4 was closed and costly; LLaVA approximates a GPT-4 style visual assistant openly, essentially a GPT-style decoder whose input is fed by a vision encoder.</p>` },
    { h: R`Two-stage training and the loss`, t: "exam", b: R`<table><tr><th>Stage</th><th>Trainable</th><th>Frozen</th><th>Data</th></tr>
<tr><td>1 Feature alignment</td><td>projection $W$ only</td><td>CLIP ViT, Vicuna</td><td>~595K CC3M image-text pairs (descriptions)</td></tr>
<tr><td>2 Instruction tuning</td><td>$W$ + Vicuna</td><td>CLIP ViT</td><td>all three GPT-4 datasets</td></tr></table>
<ul>
<li><strong>Why two stages:</strong> stability and different sub-tasks; alignment <em>and</em> instruction-following in one loss is "too much" for the model. Going straight to stage 2 is possible but worse.</li>
<li><strong>Why encoder frozen in stage 2:</strong> the image is fixed, only the language side varies across the data; the goal is to make the LLM aware of the image.</li>
</ul>
$$\mathcal L=-\sum_t\log p_\theta(x_t\mid x_{\lt t},\text{image},\text{instruction}),$$
<p>on <strong>answer tokens only</strong> (after <code>ASSISTANT:</code>), in both stages; stops at the EOS token. <strong>Why no contrastive loss like CLIP/BLIP:</strong> there fusion happens inside the model and needs specialised ITC/ITM losses; in LLaVA both modalities are just input vectors, so the standard next-token cross-entropy suffices.</p>
<p>Results quoted: ~85% of GPT-4 reference quality; ScienceQA 90.9% (92.5% in the generative framing).</p>` },
    { h: R`Variants, Qwen-VL and the logit lens`, b: R`<ul>
<li><strong>LLaVA to 1.5 to Next:</strong> recipe is constant (encoder + projection + LLM). Changes: linear projection becomes a <strong>2-layer MLP</strong>, higher resolution, other LLMs. Limitations: information lost in CLIP embeddings, LLM bias, poor low-resolution perception. Specialised domains (medical, finance) need fine-tuning.</li>
<li><strong>Qwen-VL:</strong> extends to <strong>video</strong> by changing only the vision encoder and laying frames out as a sequence; unlike base LLaVA its vision encoder is <strong>trainable</strong>.</li>
<li><strong>Image generation</strong> (e.g. Stable Diffusion) is a different thread (diffusion); LLaVA does image+text to text only. ChatGPT's mixed read/generate design is not public; conceptually a diffusion head and a language head switched by task.</li>
<li><strong>Logit lens:</strong> push each layer's hidden state through the output (unembedding) head to see which token the model "is thinking of" at each depth; predictions sharpen with depth. Used for debugging and for studying the effect of vision tokens.</li>
</ul>` },
    { h: R`Frequent traps in L17`, t: "pitfall", b: R`<ul>
<li>Saying LLaVA uses the <strong>CLS</strong> token: it uses all patch vectors.</li>
<li>Saying $H_v$ <strong>are word embeddings</strong>: they are aligned to the language distribution but are not words.</li>
<li>Claiming LLaVA has a <strong>cross-attention</strong> fusion module: it does not; fusion is implicit self-attention over concatenated tokens.</li>
<li>Stage 1 trains <strong>only</strong> $W$ (randomly initialised); Stage 2 trains $W$ <em>and</em> the LLM; the encoder is frozen in <em>both</em> (except Qwen-style models).</li>
<li>Putting the loss on the instruction or image tokens: it is on the answer tokens only.</li>
<li>Thinking bidirectional attention enables generation, or that BERT is the dominant recipe today (GPT-style decoders are).</li>
</ul>` },
  ];
})();
