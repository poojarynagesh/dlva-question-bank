(function () {
  const R = String.raw;
  (window.QB_CONCEPTS = window.QB_CONCEPTS || {})["L23"] = [
    { h: R`From CLIP to VLMs that "see and tell"`, t: "def", b: R`<p>The professor's analogy is a <strong>wine expert</strong> who looks, swirls, smells and tastes before giving a rich description. Language models could write the description but not see; vision models could say "red" or "white" but not describe fluently; a <strong>VLM</strong> can do both.</p>
<ul><li><strong>CLIP-like</strong>: image and caption are pulled into one embedding space — great representations, but not generative.</li>
<li><strong>Generative VLMs</strong> (Flamingo, LLaVA): image embedding → projection into the LLM's space → the LLM writes long text.</li>
<li>"VLM", "large VLM", "multimodal LLM", "vision LLM" all mean roughly a big text LLM with a vision input.</li></ul>
<p>Today's question: how do these models <em>reason</em> about what they see?</p>` },
    { h: R`System 1 vs System 2`, t: "def", b: R`<p>Two exercises were given to the class.</p>
<ul><li><strong>Bat and ball</strong>: total 110, bat costs 100 more. Gut answer 10; correct: $b+(b+100)=110\Rightarrow b=5$ (bat 105). The gut answer would make the total $10+110=120$.</li>
<li><strong>Mental rotation</strong>: are two shapes the same object rotated or mirror images? It mixes verbal, visual and abstract steps — reasoning can happen in words <em>or</em> in images.</li></ul>
<table><tr><th></th><th>System 1</th><th>System 2</th></tr>
<tr><td>Style</td><td>fast, gut, from priors</td><td>slow, deliberate, decomposed</td></tr>
<tr><td>LLM analogue</td><td>plain next-token predictor answers directly</td><td>generates a reasoning trajectory first</td></tr></table>
<p>Example: "How many R's in <em>raspberry</em>?" — early models blurted 1, 2 or 4 (System 1); thinking models do it well.</p>` },
    { h: R`How thinking came to LLMs: prompt, SFT, RL`, t: "exam", b: R`<ol><li><strong>Chain-of-thought prompting</strong>: show how a human would think, or say "let's think step by step". Essence: spend more tokens decomposing before answering. Modern reasoning also has branches, backtracking and loops.</li>
<li><strong>SFT</strong>: train on a big set of human reasoning responses, maximising
$$p(\text{reasoning}\mid q)\cdot p(\text{answer}\mid\text{reasoning},q).$$</li>
<li><strong>RL</strong> (DeepSeek-style): sample several reasoning traces and reward only whether the <em>final answer</em> is correct. Reward = human-preference model (RLHF) or rule-based verifier (<strong>RLVR</strong>). Models then think on their own — <strong>thinking models</strong>.</li>
<li><strong>Inference</strong>: more thinking tokens = more <strong>test-time compute</strong> = more capability.</li></ol>
<table><tr><th>Stage</th><th>Role</th></tr>
<tr><td>Pre-training</td><td>world knowledge via next-token prediction</td></tr>
<tr><td>SFT</td><td>teaches <em>how</em> thinking looks</td></tr>
<tr><td>RL</td><td>lets the model explore efficient trajectories</td></tr></table>` },
    { h: R`Pitfall: chain of thought is not an explanation`, t: "pitfall", b: R`<p>Many treat the written CoT as the model's explanation. Work shows it is <strong>unfaithful</strong> at times: there can be internal reasoning that is never written. A correct answer does not prove that the written steps caused it. <strong>Faithfulness</strong> = whether the stated CoT reflects the actual computation. Use CoT as extra computation, not as explainability.</p>` },
    { h: R`Multimodal CoT and the three families`, t: "def", b: R`<p>An image is expensive: a 30-token question may come with an image of <strong>10–100×</strong> more tokens. Multimodal usage: (1) image in, text out (most common), (2) image output, (3) <strong>multimodal thoughts</strong> — the reasoning itself uses images.</p>
<table><tr><th>Family</th><th>What happens</th><th>Weakness</th></tr>
<tr><td>Thinking <em>about</em> images</td><td>image + question, then text CoT</td><td>prior-driven hallucination; text may be the wrong medium; CoT can even hurt vision tasks</td></tr>
<tr><td>Thinking <em>with</em> images</td><td>calls tools mid-reasoning: crop, depth, segmentation, auxiliary lines</td><td>slow, token explosion, bounded by tool quality, complexity</td></tr>
<tr><td>Latent visual reasoning</td><td>hidden continuous thoughts, no tools</td><td>uninterpretable, no RL, possibly unused</td></tr></table>
<p><strong>Worked example (cost):</strong> question 30 tokens, image 1500. Plain: 1530. Crop 4 times: $30+5\cdot1500=7530\approx4.9\times$. Four latent thoughts: about 1534.</p>` },
    { h: R`The golfer failure and why VLMs fail`, b: R`<p>Live demo: three golfers, only one has sunglasses and a dark hat — most VLMs answer correctly. Harder variant: everyone wears sunglasses and all hats are white. The model hallucinates a black cap, insists when told to look again, <strong>agrees when falsely told "it's red"</strong>, and crops badly. Interpretation: it has likely seen the original image many times and uses its <strong>prior</strong> rather than grounding in the pixels.</p>
<p>Competing hypotheses:</p>
<ul><li><strong>Eyes Wide Shut</strong>: vision encoders are weak.</li>
<li>Encoders are good, but the <strong>projection</strong> is not — the LLM cannot use what the embeddings carry.</li>
<li>For vision, CoT may degrade performance, unlike maths or planning.</li></ul>` },
    { h: R`Why latent reasoning: effective depth and commitment`, t: "exam", b: R`<p><strong>Effective depth.</strong> A token crosses $L$ layers. Prompt tokens are processed in parallel, each with depth $L$. If outputs are fed back and run through all layers again, $T$ times, information travels
$$T\times L$$
layers. E.g. $L=24$, $T=100$: 2400. This is one explanation of why CoT helps.</p>
<p><strong>Limit of text CoT.</strong> Each step is committed to a single highest-probability token: no backtracking, no room for uncertainty. Latent steps keep many trajectories alive — similar in spirit to <strong>JEPA</strong>: predict in latent space, not in pixel (or word) space.</p>
<p><strong>Latent</strong> means internal and not directly readable — like an autoencoder's code vector: it holds structure and meaning, a decoder can use it, a human cannot read it.</p>` },
    { h: R`Coconut: chain of continuous thought`, t: "def", b: R`<p>Meta's text-only method. Normal CoT: last hidden state → token → re-embed → feed back. <strong>Coconut</strong>: after a start delimiter, skip the conversion — the <strong>last hidden state itself is the next input embedding</strong>; only the final answer is decoded.</p>
<p><strong>Training:</strong> take CoT data (question, thought steps, answer). Replace the first step by $K$ continuous thought(s), later the first two, and so on. <strong>No direct supervision, no loss on the latents</strong> — only the usual autoregressive loss, so a latent is good if it helps generate the next step. $K$ is empirical. No guarantee it can be decoded back to the original sentence.</p>
<p><strong>Graph-path example:</strong> unique made-up names (Alex → Grimpus → … → bompus). Explicit CoT commits to one child (depth-first-like, no backtracking) and often fails. Replacing <em>one</em> step was not enough; <em>two</em> gave the correct path. Probing showed all candidate nodes with equal probability — a superposition behaving like <strong>BFS</strong> (not the exact algorithm). Later papers dispute this; gains are modest (~2–3%).</p>` },
    { h: R`Latent visual reasoning and its supervision`, b: R`<p>Layout: image + question embeddings → optional text → latent-start delimiter → continuous embeddings fed back (never decoded) → latent-end delimiter → answer. Unlike Coconut, vision versions usually have <strong>explicit supervision</strong> on the latents, in many schemes:</p>
<ul><li><strong>ROI zoom</strong>: data with a region box + caption; train the latent to be close to the embedding of the cropped ROI, so attention moves to that part ("zooming in" without a tool).</li>
<li><strong>Transformation puzzles</strong>: richer signals — match sub-parts, track how parts move.</li></ul>
<p>Losses can be cosine or MSE. Example: $z=(3,4)$, $e=(4,3)$: $\cos=24/25=0.96$, cosine loss $0.04$, MSE $1$.</p>` },
    { h: R`Pitfalls: open problems and Gaze Heads`, t: "pitfall", b: R`<ul><li><strong>No RL on latents.</strong> RL needs token probabilities; latents are never turned into text, so only SFT can supervise them. Hence we cannot be sure what they hold.</li>
<li><strong>Probes</strong> (very recent, not certain): adding noise, zeroing, or swapping latents barely changes answers — the model may rely on the image instead; the $K$ latents are homogeneous (similar cosine similarities).</li>
<li><strong>Interpretability</strong>: a multi-company paper argued against latent reasoning for text; for vision it still makes sense.</li>
<li>Do not claim latent reasoning "beats" explicit CoT — it does not yet.</li></ul>
<p><strong>Gaze Heads</strong> (a normal VLM, not latent reasoning): about 8% of neurons causally control where the model looks while generating text. On a 5-panel comic, boosting these heads toward another panel makes the narration follow that panel — no retraining, so the evidence is causal.</p>` },
  ];
})();
