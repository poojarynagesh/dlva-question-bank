(function () {
  const R = String.raw;
  (window.QB_CONCEPTS = window.QB_CONCEPTS || {})["L20"] = [
    { h: R`What this session was`, b: R`<p>27 Oct was <strong>not a regular lecture</strong>. The TA ran a project doubt-clearing and logistics session, then screen-shared a <em>past project</em> of his own as an example of the expected level. Regular classes resumed on Thursday.</p>
<p>The only technical content is the worked example, which reuses <strong>flow matching</strong> (Lecture 19) in a real pipeline and shows how to debug it. Expect exam questions to use that example (arithmetic, diagnosis), and the project/exam facts below.</p>` },
    { h: R`Project: the minimum bar`, t: "def", b: R`<ol>
<li><strong>Hands-on</strong>: read recent papers (the recent-advances classes are the topic pool) and <strong>run the released code</strong>; most papers release code and weights.</li>
<li><strong>Some analysis</strong>: find <em>failure modes</em> (papers often mention them; expand), suggest <em>lightweight improvements</em> (cheap modifications), or <em>compare methods</em>.</li>
</ol>
<p>Topic can be changed up to the midterm presentation (infeasible compute or a weak idea). Solo projects allowed. Technical help: 3D topics message Badrinath; generative models message Varun. Written feedback on all proposals promised within about two days.</p>` },
    { h: R`Dates and logistics`, t: "exam", b: R`<table>
<tr><th>Item</th><th>Detail</th></tr>
<tr><td>Midterm presentation</td><td>10 and 12 Nov, 4:00–5:30 pm; <strong>10 min per group</strong>; <strong>not graded</strong></td></tr>
<tr><td>Final presentation</td><td><strong>Graded</strong>; after everyone's last exam (many end 2 Dec); analysis completed</td></tr>
<tr><td>Final exam</td><td>26 Nov, 5:00–8:00 pm; offline preferred, online in the same slot if needed (form: 21 responses, 15 offline, 6 online)</td></tr>
<tr><td>Syllabus</td><td>Guest lectures (flow matching, 3D reconstruction, VLMs) are <strong>included</strong>; hard to test, but read them all</td></tr>
<tr><td>Assignments</td><td>Assignment 2 posted 26 Oct, due about one week after the session; 3 late days in total; Assignment 1 graded as fast as possible</td></tr>
</table>
<p>At the midterm you need to show you <em>understood the literature</em> and can state limitations; a solution is not expected. If a feature is missing you may present how you would add it and what problems that raises.</p>` },
    { h: R`The example: precise image generation`, t: "def", b: R`<p><strong>Problem.</strong> Text-to-image models give little precise control: a casual user says "red ball, light from the right", but a designer needs exact RGB values, light position and intensity. Idea: condition on Blender-like scene properties for simple scenes (a green cube on a gray background), aiming at a <em>neural / differentiable renderer</em> replacing the rendering engine. Data: CLEVR-style scenes; one camera (described by radius from the centre and height) and one spotlight at the centre.</p>
<p><strong>Pipeline.</strong></p>
$$p\in\mathbb R^{16}\xrightarrow{\text{prop. encoder}}\mathbb R^{2048}\xrightarrow{\text{flow matching}}\mathbb R^{2048}\xrightarrow{\text{decoder}}256\times256\text{ image}$$
<p>The 16 numbers (colour, light, camera, in standard representations) were judged too ill-posed as an image description, so they are expanded to 2048. Flow matching transports the <em>properties distribution</em> to the <em>image-latent distribution</em> with the Euler update $x_{t+\Delta t}=x_t+\Delta t\,v_\theta(x_t,t)$.</p>` },
    { h: R`Why both ends must have the same size`, b: R`<p>Flow matching builds training points as $X_t=(1-t)X_0+tX_1$ with target velocity $X_1-X_0$. Adding and subtracting two vectors needs equal dimension, so a 16-d source and a 2048-d target do not work directly. Options tried for the properties encoder:</p>
<ul><li><strong>zero-padding</strong>: the 16 numbers sit in a 16-d subspace of $\mathbb R^{2048}$; no new information, just room;</li><li>a trained <strong>properties autoencoder</strong>.</li></ul>
<p>Other ablations: image autoencoder (own vs pre-trained) and flow backbone (<strong>U-Net</strong> vs <strong>DiT</strong>).</p>` },
    { h: R`Compression arithmetic`, t: "exam", b: R`<p>Compression ratio = input size / latent size.</p>
$$\frac{256\cdot256\cdot3}{2048}=\frac{196{,}608}{2048}=96\times$$
<p>Worked variants (same method):</p>
<ul><li>latent of 8192 numbers: $196{,}608/8192=24\times$;</li><li>$512\times512\times3$ into 2048: $786{,}432/2048=384\times$;</li><li>$512\times512\times3$ into $64\times64\times4=16{,}384$: $48\times$.</li></ul>
<p>The lecturer's own autoencoder gave very blurry reconstructions at $96\times$; a newer pre-trained model (MIT Han Lab, name not stated in class, identity uncertain) reached near pixel-perfect reconstruction at that ratio, so he switched. Lesson: the decoder sets a ceiling on image quality; check reconstructions of real images before blaming the flow model.</p>
<p>Do not confuse with 16 to 2048, which is an <em>expansion</em> by 128.</p>` },
    { h: R`Debugging story: compounding error`, t: "exam", b: R`<ol>
<li><strong>Symptom</strong>: training loss decreased, generated images were poor.</li>
<li><strong>Look along the trajectory</strong>: the <em>first</em> velocity prediction had a very high MSE. Each Euler step starts from the previous point, so the error compounds.</li>
<li><strong>Cheat test</strong>: give the model the ground-truth first step, then let it continue alone. Loss dropped a lot and images became good, so the problem is concentrated at the first step. (A diagnostic only; the truth is unknown at test time.)</li>
<li><strong>Theory</strong>: the model never sees $t=0$ in training (continuous $t$ never hits exactly 0). Sampling $t=0$ explicitly improved quality but not perfectly. Other theories existed; some were probably wrong in hindsight, but proposing and testing them was the point.</li>
<li><strong>Result</strong> (after small hacks): smooth control of light position (the shadow moves), object position and object colour (green to black).</li>
</ol>
<p><strong>Worked numbers.</strong> True straight path from $(0,0)$, velocity $(4,-2)$; the model predicts $(3,0)$ at step 1 and the exact $(4,-2)$ thereafter, 10 steps of 0.1. After step 1: $(0.3,0)$ vs $(0.4,-0.2)$. After all steps: $(3.9,-1.8)$ vs $(4,-2)$. Error $(-0.1,0.2)$ never shrinks. Euler error after one step is $\Delta t\times$ velocity error.</p>` },
    { h: R`Practical advice: compute and data`, b: R`<table>
<tr><th>Question</th><th>Answer given</th></tr>
<tr><td>GPU access</td><td>Ask computing staff (he will also enquire); lab GPUs are a limited last resort; Colab is an option; message him individually</td></tr>
<tr><td>Lightweight models</td><td>Fine; smaller variants are acceptable even in research; remind evaluators of hardware limits, no penalty</td></tr>
<tr><td>STL-10</td><td>Fine: higher resolution than CIFAR-10 ($96\times96\times3=27{,}648$ values vs $3072$, 9 times more), light enough for CPU</td></tr>
<tr><td>Standard datasets</td><td>ImageNet (about 1 M images) for classification and representation learning; Tiny ImageNet is smaller but still probably too large for CPU-only teams</td></tr>
</table>
<p>The expected habit, in the lecturer's words: <em>take a pre-existing model, try different things, propose why something happens, add lightweight solutions.</em></p>` },
    { h: R`Common mistakes`, t: "pitfall", b: R`<ul>
<li>Saying the <strong>midterm presentation is graded</strong> (it is not) or that the <strong>final presentation comes before the exam</strong> (it comes after everyone's last exam).</li>
<li>Assuming <strong>a low training loss means good samples</strong>: sampling is sequential and an early error compounds; the loss does not measure the whole trajectory.</li>
<li>Blaming the flow model for <strong>blurry images</strong> without testing the autoencoder alone.</li>
<li>Treating the cheat test (ground-truth first step) as a <strong>usable sampler</strong>; it is only a diagnostic.</li>
<li>Calling a partial improvement (explicit $t=0$) a <strong>proof</strong> of the cause.</li>
<li>Mixing up <strong>compression</strong> ($196{,}608\to2048$, $96\times$) with the <strong>expansion</strong> $16\to2048$ ($128\times$).</li>
<li>Claiming guest lectures are <strong>not in the syllabus</strong>: they are.</li>
</ul>` },
  ];
})();
