(function () {
  const R = String.raw;
  (window.QB_CONCEPTS = window.QB_CONCEPTS || {})["L16"] = [
    { h: R`What a generative model learns`, t: "def", b: R`<p>A <strong>discriminative</strong> model learns $p(y\mid x)$. A <strong>generative</strong> model learns the data distribution $p_{\text{data}}(x)$ (or a joint) so that it can <em>sample</em> new data that resembles the training population. It must not simply memorise and return a training image.</p>
<p>An $H\times W\times C$ image is a point in a huge space, but natural images lie on a thin structured <strong>manifold</strong>; most random pixel arrays are noise. A generator maps a simple latent $z\sim p(z)$ (e.g. $\mathcal N(0,I)$) to the data space, $x=G_\theta(z)$, and training <em>bends</em> the simple prior onto that manifold. Nearby $z$ give related images, so interpolating in $z$ changes pose, identity or style smoothly.</p>
<p><strong>Dataset limits the model:</strong> if zoom, orientation, object size or readable text never vary in the training data, the model cannot reliably produce them. It can interpolate, not invent unseen modes.</p>` },
    { h: R`Sampling foundations: inverse CDF, rejection, reparameterisation`, b: R`<p>Generation = turning a simple random source into samples from a target distribution.</p>
<ul>
<li><strong>Discrete:</strong> fair coin: $u\sim U[0,1]$, heads if $u\lt0.5$. A biased coin or a die just splits $[0,1]$ into intervals of the right widths.</li>
<li><strong>Inverse-transform:</strong> $u\sim U(0,1)$, $x=F_X^{-1}(u)$ follows the target. Needs a tractable inverse CDF.</li>
<li><strong>Rejection sampling:</strong> pick an easy proposal $q$ and $M$ with $p(x)\le Mq(x)$. Draw $x\sim q$, $u\sim U(0,1)$; accept if $u\le \dfrac{p(x)}{Mq(x)}$. Exact, but wasteful when $q$ fits $p$ poorly or the dimension is high.</li>
<li><strong>Reparameterisation:</strong> $z=\mu+\sigma\odot\epsilon$, $\epsilon\sim\mathcal N(0,I)$. All randomness sits in $\epsilon$; $\mu,\sigma$ enter through differentiable operations, so gradients flow through the sample (key for VAEs).</li>
</ul>
<p><strong>Mini-example (inverse CDF):</strong> exponential with rate $\lambda$: $F(x)=1-e^{-\lambda x}$, so $x=-\tfrac1\lambda\ln(1-u)$. With $\lambda=2,\ u=0.5$: $x=-\tfrac12\ln0.5\approx0.347$.</p>` },
    { h: R`Autoencoder: reconstructs but cannot generate`, b: R`<p>$z=E_\phi(x)$, $\hat x=D_\theta(z)$, loss $\mathcal L_{\text{rec}}=\|x-\hat x\|_2^2$. The bottleneck forces compression and useful features.</p>
<p>But the code space is only trained <em>at the encoder's outputs</em>. Nothing forces the codes to fill a known, smooth region, so a random $z$ can land in a "hole" and decode to garbage. A generative latent model must <strong>define a distribution you can sample from</strong>. VAEs do this with a KL term to a prior; GANs do it by training $G$ directly on noise.</p>` },
    { h: R`GAN: the minimax game`, t: "exam", b: R`<p><strong>Generator</strong> $G$: noise $z\mapsto G(z)$. <strong>Discriminator</strong> $D$: probability that the input is real.</p>
$$\min_G\max_D V(D,G)=\mathbb E_{x\sim p_{\text{data}}}[\log D(x)]+\mathbb E_{z\sim p(z)}[\log(1-D(G(z)))].$$
<ul>
<li>$D$ maximises: wants $D(x)\to1$ on real and $D(G(z))\to0$ on fake; both log terms then approach $0$ (their maximum).</li>
<li>$G$ minimises the second term: wants $D(G(z))\to1$.</li>
<li><strong>Non-saturating generator loss</strong> $\mathcal L_G=-\mathbb E[\log D(G(z))]$ is used in practice because early on $D(G(z))\approx0$ and $\log(1-D(G(z)))$ is flat (weak gradient), whereas $-\log D$ is steep.</li>
<li><strong>Alternating training:</strong> sample real + noise, generate fakes, update $D$; then update $G$ by back-propagating through $D$ (D's weights not updated in that step); repeat.</li>
<li><strong>Ideal equilibrium:</strong> $p_g=p_{\text{data}}$, $D(x)=\tfrac12$ everywhere (the optimal $D^*=\dfrac{p_{\text{data}}}{p_{\text{data}}+p_g}$, standard result).</li>
</ul>
<p><strong>Number check:</strong> at equilibrium $V=\log\tfrac12+\log\tfrac12=-\log4\approx-1.386$ (natural log).</p>
<p>A basic GAN needs <em>no labels</em>. A <strong>conditional GAN</strong> feeds a class/condition $y$ to both networks: $x=G(z,y)$.</p>` },
    { h: R`GAN training problems and variants`, t: "pitfall", b: R`<ul>
<li><strong>Instability / balance:</strong> a two-player game, not a single stationary loss. If $D$ is too strong it rejects every fake confidently and $G$ gets uninformative gradients; if too weak, a poor signal. Learning rates, update ratios, normalisation, architecture all matter.</li>
<li><strong>Mode collapse:</strong> $G$ finds a few outputs that fool $D$ and ignores other modes (e.g. near-identical faces). Samples look realistic individually but diversity is low. Remedies: better objectives, minibatch discrimination, feature matching, diversity regularisation.</li>
<li><strong>Evaluation needs two things:</strong> <em>fidelity</em> (realism) and <em>diversity/coverage</em>. A sharp but repetitive GAN is not a success.</li>
</ul>
<table><tr><th>Variant</th><th>Idea</th></tr>
<tr><td>DCGAN</td><td>conv / transposed-conv generator and discriminator for images</td></tr>
<tr><td>WGAN</td><td>Wasserstein (Earth-Mover) objective, better gradients; needs Lipschitz constraint (clipping or gradient penalty)</td></tr>
<tr><td>f-GAN</td><td>adversarial training for general $f$-divergences</td></tr>
<tr><td>StyleGAN</td><td>style injected at each resolution, coarse-to-fine control of faces</td></tr></table>
<p>GAN is an objective/training framework, not a fixed architecture (CNNs or transformers both possible).</p>` },
    { h: R`Probability tools behind the VAE`, t: "def", b: R`<ul>
<li><strong>Joint:</strong> $p(x,z)=p(x\mid z)p(z)=p(z\mid x)p(x)$.</li>
<li><strong>Evidence (marginal):</strong> $p_\theta(x)=\int p_\theta(x\mid z)p(z)\,dz$, intractable for a neural decoder.</li>
<li><strong>Posterior (Bayes):</strong> $p_\theta(z\mid x)=\dfrac{p_\theta(x\mid z)p(z)}{p_\theta(x)}$, hence also intractable. The encoder $q_\phi(z\mid x)$ is a tractable <em>approximation</em> (variational inference).</li>
<li><strong>KL divergence:</strong> $D_{\mathrm{KL}}(q\|p)=\mathbb E_q[\log\tfrac{q}{p}]\ge0$, zero iff $q=p$ a.e., <em>asymmetric</em>.</li>
<li><strong>Jensen (log concave):</strong> $\log\mathbb E[X]\ge\mathbb E[\log X]$.</li>
</ul>
<p><strong>Closed-form KL</strong> (diagonal Gaussian vs $\mathcal N(0,I)$):
$$D_{\mathrm{KL}}=-\tfrac12\sum_j\bigl(1+\log\sigma_j^2-\mu_j^2-\sigma_j^2\bigr).$$</p>
<p><strong>Worked numbers:</strong> one latent dim with $\mu=1,\ \sigma^2=1$: $-\tfrac12(1+0-1-1)=0.5$. With $\mu=0,\sigma^2=1$: $0$ (posterior equals prior). With $\mu=0,\ \sigma^2=e^{-1}$: $-\tfrac12(1-1-0-0.368)=0.184$.</p>` },
    { h: R`ELBO derivation and the VAE loss`, t: "exam", b: R`<p>Start: $\log p_\theta(x)=\log\int q_\phi(z\mid x)\dfrac{p_\theta(x,z)}{q_\phi(z\mid x)}dz$. Write as an expectation and apply Jensen:
$$\log p_\theta(x)\ge\mathbb E_{q_\phi}\Bigl[\log\tfrac{p_\theta(x,z)}{q_\phi(z\mid x)}\Bigr]=\underbrace{\mathbb E_{q_\phi}[\log p_\theta(x\mid z)]}_{\text{reconstruction}}-\underbrace{D_{\mathrm{KL}}(q_\phi(z\mid x)\|p(z))}_{\text{regulariser}}=\mathcal L_{\text{ELBO}}.$$</p>
<p><strong>Gap:</strong> $\log p_\theta(x)-\mathcal L_{\text{ELBO}}=D_{\mathrm{KL}}(q_\phi(z\mid x)\|p_\theta(z\mid x))\ge0$. A better approximate posterior gives a tighter bound.</p>
<p><strong>Loss to minimise</strong> = negative ELBO. Gaussian likelihood gives (roughly) MSE reconstruction; Bernoulli likelihood gives binary cross-entropy.</p>
<p><strong>VAE pipeline:</strong> encoder outputs $\mu(x)$ and $\log\sigma^2(x)$; sample $z=\mu+\sigma\odot\epsilon$; decoder gives $p_\theta(x\mid z)$. At generation time, sample $z\sim\mathcal N(0,I)$ and decode. The KL term is what makes this valid (codes are pulled toward the prior).</p>` },
    { h: R`GAN vs VAE, and common mix-ups`, t: "pitfall", b: R`<table><tr><th>Aspect</th><th>GAN</th><th>VAE</th></tr>
<tr><td>Principle</td><td>adversarial game</td><td>variational likelihood bound</td></tr>
<tr><td>Quality</td><td>sharper</td><td>smoother / blurrier</td></tr>
<tr><td>Stability</td><td>hard, sensitive</td><td>easier, stable</td></tr>
<tr><td>Coverage</td><td>mode collapse risk</td><td>broader; posterior-collapse risk</td></tr>
<tr><td>Inference</td><td>no encoder in basic GAN</td><td>encoder approximates $p(z\mid x)$</td></tr></table>
<ul>
<li>Neither is "the best": the professor stressed the choice depends on the goal, and that <strong>diffusion models</strong> now dominate many applications (next lectures).</li>
<li>Do not say the encoder gives the <em>exact</em> posterior; it is a variational approximation because $p(x)$ is intractable.</li>
<li>Reparameterisation is needed because direct random sampling blocks pathwise gradients; the randomness is moved to $\epsilon$.</li>
<li>The KL term is not just "regularisation for its own sake": without it the VAE degenerates into an ordinary autoencoder that cannot be sampled.</li>
<li>Text inside generated images: learnable only if present in the training data, and exact spelling is hard because the model learns visual patterns.</li>
</ul>` },
  ];
})();
