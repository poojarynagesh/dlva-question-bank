(function () {
  const R = String.raw;
  (window.QB_CONCEPTS = window.QB_CONCEPTS || {})["L19"] = [
    { h: R`DDPM recap and its three pain points`, t: "def", b: R`<p>DDPM: the <strong>forward</strong> process adds Gaussian noise over ~1000 timesteps until pure noise; the <strong>reverse</strong> process is a network that removes noise step by step. It predicts the noise:
$$\mathcal L_{\text{DDPM}}=\mathbb E_{x_0,\epsilon,t}\bigl[\|\epsilon-\epsilon_\theta(x_t,t)\|^2\bigr],\quad x_t=\sqrt{\bar\alpha_t}\,x_0+\sqrt{1-\bar\alpha_t}\,\epsilon.$$</p>
<p>Problems highlighted: (1) <strong>~1000 sequential steps</strong>, slow; (2) <strong>curved trajectories</strong> from noise to data, so small steps are needed; (3) a finicky <strong>noise schedule</strong> ($\beta_t,\bar\alpha_t$) to tune.</p>
<p>Numeric check: with $\bar\alpha_t=0.64$, $x_0=1$, $\epsilon=0.5$: $x_t=0.8\cdot1+0.6\cdot0.5=1.1$.</p>` },
    { h: R`The score and the flow picture`, b: R`<p><strong>Score:</strong> $s(x)=\nabla_x\log p(x)$, a vector field pointing toward high probability density. Analogy from the lecture: log-density is a landscape of hills (data) and valleys; the score arrows always point <em>uphill</em>. Diffusion is tied to score matching.</p>
<p><strong>Flow matching</strong> instead learns a <strong>velocity field</strong> $v_\theta(x_t,t)$, the direction and speed to move at $(x_t,t)$, transporting noise to data. Convention here: $X_0\sim\mathcal N(0,I)$ is <em>noise</em>, $X_1\sim$ data, $t\in[0,1]$ <strong>continuous</strong>. Ideal paths are <strong>straight</strong>, so far fewer steps; no 1000-step discretisation and no noise schedule.</p>
<p>Careful: here $t=0$ is noise and $t=1$ is data (the reverse of the DDPM habit of $t=T$ being noise).</p>` },
    { h: R`The flow-matching loss (learn this)`, t: "exam", b: R`<ol>
<li>$t\sim U(0,1)$, $X_0\sim\mathcal N(0,I)$, $X_1\sim$ data.</li>
<li>Linear interpolant: $X_t=(1-t)X_0+tX_1$.</li>
<li>Target velocity (constant along the line): $\dfrac{dX_t}{dt}=X_1-X_0$.</li>
<li>Regress: $$\mathcal L_{\text{FM}}=\mathbb E_{t,X_0,X_1}\bigl[\|v_\theta(X_t,t)-(X_1-X_0)\|^2\bigr].$$</li>
</ol>
<p><strong>Worked example (1D):</strong> $X_0=-1$, $X_1=3$. Target velocity $=4$. At $t=0.25$: $X_t=0.75(-1)+0.25(3)=0$. If the network predicts $v_\theta=3$ there, the squared error is $(3-4)^2=1$.</p>
<p>The network learns, averaged over all pairs, the field carrying the whole noise distribution onto the whole data distribution (individual lines cross, so the learned field is an average). Advantages: simple fixed loss, continuous time, no schedule, straight targets.</p>` },
    { h: R`Sampling: an ODE, not an SDE`, t: "exam", b: R`<ul>
<li>DDPM sampling solves an <strong>SDE</strong>: fresh randomness at each reverse step.</li>
<li>Flow sampling solves a deterministic <strong>ODE</strong>: $\dfrac{dX_t}{dt}=v_\theta(X_t,t)$, $X_0\sim\mathcal N(0,I)$, integrate $t:0\to1$.</li>
<li><strong>Forward Euler:</strong> $X_{t+\Delta t}=X_t+\Delta t\,v_\theta(X_t,t)$.</li>
</ul>
<p><strong>Worked example:</strong> if the field were perfectly straight with $v=4$ from $X_0=-1$: one Euler step $\Delta t=1$ gives $-1+4=3=X_1$ exactly. With 4 steps of $\Delta t=0.25$: $-1\to0\to1\to2\to3$. Straight paths mean even one big step lands correctly; curved paths need many small steps.</p>` },
    { h: R`ODE solvers and NFE`, b: R`<table><tr><th>Solver</th><th>Type</th><th>Note</th></tr>
<tr><td>Forward Euler</td><td>1st order</td><td>simplest; ~10-50 steps for good quality</td></tr>
<tr><td>Heun / Midpoint</td><td>2nd order</td><td>more accurate per step</td></tr>
<tr><td>DPM-Solver++</td><td>high-order, diffusion-specialised</td><td>fast few-step sampling</td></tr>
<tr><td>Dopri / RK45</td><td>5th order, adaptive</td><td>chooses step size; very accurate</td></tr></table>
<p>The efficiency metric is <strong>NFE</strong> (number of function evaluations = network calls). Higher-order/adaptive solvers reach good samples with fewer steps but spend more compute per step. Heun uses 2 evaluations per step, so 10 Heun steps $\approx$ 20 NFE.</p>` },
    { h: R`Reflow: straighten the paths for 1-step generation`, t: "exam", b: R`<p><strong>Problem:</strong> in practice flow trajectories are still somewhat curved: the lecture's cat picture is blurry at $n=1$, still bad at $n=2$, sharp at $n=1000$.</p>
<p><strong>Reflow changes only how $X_1$ is chosen, not the loss:</strong></p>
<ol>
<li>Standard FM: $X_1$ is a random data sample unrelated to $X_0$.</li>
<li>Reflow: take noise $X_0$, run the <em>trained</em> model with a high-order solver and many steps to get its own endpoint $\hat X_1$.</li>
<li>Retrain with the <strong>same FM loss</strong> on pairs $(X_0,\hat X_1)$.</li>
</ol>
<p>The straight line $X_0\to\hat X_1$ now matches the model's own transport, so trajectories get straighter and a single Euler step (NFE=1) lands close to the 1000-step result; a few more steps (e.g. 25) only refine.</p>` },
    { h: R`Applications and research directions`, b: R`<ul>
<li><strong>Conditioning:</strong> academic models use class labels; big systems use the <strong>text prompt</strong>. Same loss, more data and compute.</li>
<li><strong>Flux:</strong> text-to-image and text-to-video; videos with strong temporal coherence (bike assembly, aircraft landing across frames).</li>
<li><strong>Proteina:</strong> random arrangement of molecules at $t=0$ flows to folded proteins at $t=1$ (~800 steps), conditioned on the desired fold.</li>
<li><strong>Text:</strong> words are discrete. Either embed to vectors and use a continuous flow, or use <strong>discrete flow matching</strong>. Starts from gibberish and refines the whole paragraph <em>in parallel</em>, lower latency than token-by-token autoregressive LLMs.</li>
<li><strong>Open problems:</strong> better <strong>guidance</strong> (classifier-free guidance is considered flawed); 1-2 step generation (flow works at ~10-15 steps, below ~4 is hard) via <strong>flow maps, consistency models</strong>; <strong>robotics</strong> (state to actions, needs low latency); editing/restoration; multimodal generation (Gemini-like, compute heavy).</li>
<li><strong>Detecting AI media:</strong> trained classifiers and deliberate watermarking/engineering; the flagged ones are detectable by design.</li>
</ul>` },
    { h: R`DDPM vs flow matching, and slips to avoid`, t: "pitfall", b: R`<table><tr><th></th><th>DDPM</th><th>Flow matching</th></tr>
<tr><td>Network predicts</td><td>noise $\epsilon_\theta$</td><td>velocity $v_\theta$</td></tr>
<tr><td>Time</td><td>~1000 discrete steps</td><td>continuous $[0,1]$</td></tr>
<tr><td>Path</td><td>curved</td><td>straight (ideal)</td></tr>
<tr><td>Sampling</td><td>SDE (stochastic)</td><td>ODE (deterministic)</td></tr>
<tr><td>Schedule</td><td>$\beta_t$ to tune</td><td>none</td></tr></table>
<ul>
<li>Reflow does <strong>not</strong> change the loss; only the data pairing changes.</li>
<li>The velocity target is $X_1-X_0$ (data minus noise), not $X_0-X_1$, with this lecture's convention.</li>
<li>The score ($\nabla\log p$) and the velocity are different objects, even though diffusion and flows are related.</li>
<li>Reflow's many-step solve is used to <em>make training targets</em>; the payoff is at inference (1 step).</li>
<li>Few-step is still an open problem for text-to-image/video; do not claim 1-step is solved in general.</li>
</ul>` },
  ];
})();
