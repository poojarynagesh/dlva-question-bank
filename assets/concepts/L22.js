(function () {
  const R = String.raw;
  (window.QB_CONCEPTS = window.QB_CONCEPTS || {})["L22"] = [
    { h: R`Video = images + time: why compression is everything`, t: "def", b: R`<p>A video is a tensor of shape $(1+T)\times H\times W\times 3$: the image's height, width and RGB plus a <strong>time</strong> axis. Training or sampling cost grows with the number of frames, so (as for images) we diffuse in a <strong>latent space</strong> and compress as hard as reconstruction quality allows.</p>
<p>Video diffusion = <strong>video VAE</strong> (compress) + <strong>DiT</strong> (generate in latent space) + <strong>flow-matching</strong> training (same as images). Everything new is in the first two boxes, mostly in how attention is organised.</p>` },
    { h: R`The video VAE and causality`, t: "def", b: R`<p>Input $(1+T,H,W,3)\to$ latent $(1+T',H',W',C)$ with $T'\lt T$, $H'\lt H$, $W'\lt W$. Down-sampling uses <strong>3D convolutions</strong>: the filter slides over height, width <em>and time</em> (it sees frames $t-1,t,t+1$ together). The three dimensions of "3D" are H, W and T; the channel axis is implicit, as in 2D convolution.</p>
<p><strong>Wan VAE</strong>: 4x temporal, 8x spatial. Notes' examples: 12 frames $\to$ 3; a $32\times32$ grid $\to4\times4$. The factors are <strong>fixed</strong> for a given VAE; designers pad the input to fit.</p>
<p><strong>Causal</strong> VAE: a frame's latent depends only on past frames ($t+1$ may not influence $t$). Reason: <em>variable-length videos</em>. The same frame gets the same latent in a 5 s or a 10 s clip.</p>
<p><strong>Worked example.</strong> $33\times256\times256\times3$ in the $(1+T)$ format: $T=32$, $T'=8$, latent frames $=1+8=9$, spatial $32\times32$. With $C=16$: $6{,}488{,}064\to147{,}456$ numbers, a 44x reduction.</p>` },
    { h: R`The video DiT and its attention patterns`, t: "def", b: R`<p>The DiT is nearly the image DiT: patchify the latent into $L$ tokens of dimension $D$, then self-attention, cross-attention (text tokens interact with video tokens here), feed-forward, un-patchify. The token count grows with the number of frames and attention is <strong>quadratic</strong> in tokens, so the attention pattern is the design choice.</p>
<table>
<tr><th>Pattern</th><th>Red query attends to</th><th>Role / trade-off</th></tr>
<tr><td>Spatial</td><td>nearby patches in the <em>same frame</em></td><td>per-frame quality; no link across time</td></tr>
<tr><td>Temporal</td><td>the <em>same patch position</em> in other frames</td><td>consistency (a falling ball keeps shape and colour)</td></tr>
<tr><td>Factorized</td><td>spatial then temporal, separately</td><td>cheap approximation of full attention</td></tr>
<tr><td>Full spatio-temporal</td><td>every token in the video</td><td>best quality, very expensive, <strong>most used today</strong></td></tr>
<tr><td>Sparse causal</td><td>neighbours + a few past tokens</td><td>no future leakage; less used</td></tr>
</table>
<p>Clarified in Q&amp;A: "spatial" tokens are ViT-style patches of one frame, <em>not</em> camera angles. Temporal attention can run over all frames (usual: clips are 5-10 s, up to ~1 min explored) or in chunks; 10-20 minute video is "not cracked yet".</p>` },
    { h: R`Counting attention cost`, t: "exam", b: R`<p>With $F$ latent frames and $S$ tokens per frame ($N=FS$), count query-key pairs per layer:</p>
<ul>
<li>Full: $N^2=F^2S^2$</li>
<li>Spatial: $F\,S^2$ (each frame separately)</li>
<li>Temporal: $S\,F^2$ (each position across frames)</li>
<li>Factorized: $FS^2+SF^2$</li>
</ul>
<p><strong>Example</strong> $F=8$, $S=100$: full $640{,}000$; factorized $80{,}000+6{,}400=86{,}400$ (7.4x cheaper). Doubling $F$: full cost x4, spatial x2, temporal x4. Full attention is why long video is hard; factorized buys cost but "sacrifices information".</p>
<p>Also remember the $\sqrt{d_k}$ and token-count facts from the Transformer lecture: tokens $=$ patches, ViT-style patchification.</p>` },
    { h: R`Training: plain flow matching`, t: "def", b: R`<p>Modern video diffusion models use the flow-matching paradigm of the earlier lecture. With the course convention ($x_0$ noise, $x_1$ clean data, $x_t=(1-t)x_0+tx_1$):</p>
$$\mathcal L=\mathbb E\,\lVert v_\theta(x_t,t)-(x_1-x_0)\rVert^2 .$$
<p>Training is <strong>exactly</strong> as for images; the differences are only (i) the VAE architecture and (ii) how attention works in the DiT. Sampling = integrating the learned velocity field (an ODE).</p>` },
    { h: R`Is physics solved? Benchmarks and their flaws`, t: "def", b: R`<p>No. State-of-the-art generators show a <strong>deforming paddle</strong> and a rock that <strong>climbs</strong> a hillside. Four ways to measure this:</p>
<table>
<tr><th>Benchmark</th><th>How</th><th>Flaw</th></tr>
<tr><td>VideoPhy (Google + UCLA)</td><td>LLM writes prompt, model generates clip, VLM lists physical principles, humans check; scores physical common sense and semantic adherence</td><td>Humans judge <em>plausibility</em>, not correctness; subjective</td></tr>
<tr><td>Physics-IQ (DeepMind)</td><td>Lab ground truth; 3 s conditioning, generate 5 s; MSE and IoU variants</td><td>Rigid: a valid but different continuation is penalised</td></tr>
<tr><td>VLM judge</td><td>"Is this physically accurate? yes/no"</td><td>VLMs are themselves poor at this</td></tr>
<tr><td>Principia (relational)</td><td>Two objects, one scene, one variable changed</td><td>Needs designed scenarios (seven)</td></tr>
</table>
<p><strong>Why single-image benchmarks mislead:</strong> (1) <em>scale ambiguity</em> (pinhole: small-near equals large-far; monocular depth is ill-posed, stereo is needed); (2) <em>slow-motion bias</em> (smooth, slow clips even at 24 FPS); (3) <em>hidden parameters</em> (mass, friction, restitution, deformability are invisible in one frame).</p>` },
    { h: R`Principia: relational physics and the pixel parrot`, t: "exam", b: R`<p>Idea: compare two objects against <em>each other</em>, keeping everything fixed except one variable. Frame rate, scale and material are shared, so they <strong>cancel</strong>.</p>
<p><strong>Bouncing ball.</strong> Two identical balls dropped from $H_1,H_2$ must satisfy $R_1/H_1=R_2/H_2$ (constant ratio set by the material). Check: drop 0.5 m rebound 0.30 m (ratio 0.6); a ball dropped from 1.5 m must rebound 0.90 m. A video showing 0.60 m violates the law.</p>
<p><strong>Pendulum.</strong> The period depends on the string length (for small swings $T=2\pi\sqrt{L/g}$, so 4x the length gives 2x the period). Models draw swinging pendulums but have no consistent sense that length sets the period: essentially random.</p>
<p>Seven scenarios: restitution, friction, projectile motion, mass-spring, inertia, pendulum, momentum. Scores on a 0-1 scale (0 = no understanding, 1 = perfect): Veo, Wan, Cosmos and others mostly stay within about 0.6 or lower. Term: <strong>"pixel parrot"</strong>, plausible pixels without the law behind them.</p>` },
    { h: R`Three ways to improve physics`, t: "def", b: R`<ol>
<li><strong>Better base model.</strong> (a) Fine-tune on a small physics-clean dataset (e.g. object permanence: an occluded object stays unchanged). (b) <strong>PISA</strong> (ICML 2025): sample from noise through all $T$ steps, decode with the VAE, extract depth/flow/segmentation (e.g. SAM 2), compare with ground truth, and back-propagate that differentiable reward through the sampling chain, like BPTT. Cost is huge (models 5-14 B), so <strong>truncate</strong> to the last $K$ steps ($K=1$: last step only). Any differentiable reward works, even a VLM score. Result: better, but "not great".</li>
<li><strong>Simulator in the loop.</strong> Frozen generator makes a template (appearance, camera); segment the object, image-to-3D mesh, reconstruct the background; MPM solver (Young's modulus etc. initialised by asking GPT-5); simulate, take optical flow, condition the generator. Physics is decoupled from appearance. Slow (~45 min per video), per object, single-object results.</li>
<li><strong>Learned simulator (NewtonGen, NND).</strong> A network predicts the state $Z=(x,y,v_x,v_y,\theta,\omega,S,L,A)$ over time from synthetic physics-clean data; rendered to optical flow for a motion-controlled generator. Faster: no solver.</li>
</ol>
<p>The lecturer's own current work on improving physics uses a different approach and is ongoing.</p>` },
    { h: R`Video models for robotics, and JEPA`, t: "def", b: R`<p>Why care about physics? Because video models can be <strong>robot backbones</strong>. Traditional RL needs one expensive run per task. Instead ask a video model for "the robot placing the cup from A to B": that video is the plan; mapped to the robot's action space (arm pose, location, rotation) it becomes execution.</p>
<p><strong>Unified Video Action (UVA)</strong> trains jointly on egocentric video and actions (observations $O$, actions $A$):</p>
<table>
<tr><th>Mode</th><th>Input $\to$ output</th></tr>
<tr><td>Video generation / future prediction</td><td>observations $\to$ future observations</td></tr>
<tr><td>Forward dynamics</td><td>current state + action $\to$ next state</td></tr>
<tr><td>Inverse dynamics</td><td>observation sequence $\to$ actions that realise it</td></tr>
<tr><td>Policy / planner</td><td>observations (+ actions) $\to$ actions for the next stage</td></tr>
</table>
<p><strong>JEPA</strong> (Q&amp;A): do not generate pixels; model the world in a low-dimensional representation space. The lecturer saw few improvements so far; robotics mostly uses <strong>VLAs</strong> (VLM adapters) or <strong>world action models</strong> with a video-diffusion backbone.</p>` },
    { h: R`Common mistakes on this lecture`, t: "pitfall", b: R`<ul>
<li><strong>Latent frames:</strong> in the $(1+T)$ format, 33 frames give $1+32/4=9$, not 8. The first frame stays alone.</li>
<li><strong>"Spatial" is not camera angle.</strong> It means neighbouring patches of one frame; <strong>temporal</strong> means the same patch position across frames.</li>
<li><strong>Factorized is not equal to full</strong> attention; it is a cheaper approximation. Full is still the most used.</li>
<li><strong>No special video loss:</strong> training is the unchanged velocity-MSE flow matching.</li>
<li><strong>Causal</strong> is about variable-length consistency, not speed; the compression factors are fixed, not tunable at inference.</li>
<li><strong>Benchmarks:</strong> low Physics-IQ score does not prove wrong physics (scale ambiguity, slow-motion bias, hidden parameters); VLM judges are not reliable; humans judge plausibility.</li>
<li><strong>Truncated backprop</strong> (last $K$ steps) saves memory but gives an approximate gradient; the reward must be differentiable.</li>
<li><strong>Exam note:</strong> end-term covers the whole syllabus, MCQ + short answer, similar to the midterm; know the components at working level.</li>
</ul>` },
  ];
})();
