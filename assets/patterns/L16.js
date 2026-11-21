(function () {
  const R = String.raw;
  (window.QB_PATTERNS = window.QB_PATTERNS || {})["L16"] = {
    mcq: [
      R`<p><strong>Concept:</strong> the optimal discriminator is the posterior of "real" under equal priors: $p_d/(p_d+p_g)$.</p><p><strong>Pattern:</strong> plug the two densities; at $p_g=p_d$ get 1/2, and the value is $2\log\tfrac12=-\log4$.</p><p><strong>Watch for:</strong> at equilibrium D outputs 1/2, not 1.</p>`,
      R`<p><strong>Concept:</strong> saturating vs non-saturating generator loss.</p><p><strong>Pattern:</strong> with $D=\sigma(a)$: $\partial[\log(1-\sigma)]/\partial a=-\sigma$, $\partial[-\log\sigma]/\partial a=-(1-\sigma)$. Evaluate at the given $D$ to see which is large.</p><p><strong>Watch for:</strong> same fixed points, different gradient magnitude.</p>`,
      R`<p><strong>Concept:</strong> mode collapse: fidelity without diversity.</p><p><strong>Pattern:</strong> "realistic but repetitive samples" means collapse; remedies enlarge diversity (minibatch discrimination, feature matching); evaluate both fidelity and coverage.</p><p><strong>Watch for:</strong> sharp samples do not prove the distribution is learned.</p>`,
      R`<p><strong>Concept:</strong> closed-form KL between a diagonal Gaussian and $\mathcal N(0,I)$.</p><p><strong>Pattern:</strong> per dimension $\tfrac12(\mu^2+\sigma^2-1-\ln\sigma^2)$; sum over dimensions.</p><p><strong>Watch for:</strong> the input may be $\sigma^2$, $\log\sigma^2$ or $\sigma$; do not mix them.</p>`,
      R`<p><strong>Concept:</strong> reparameterisation trick.</p><p><strong>Pattern:</strong> write $z=\mu+\sigma\epsilon$, differentiate: $\partial z/\partial\mu=1$, $\partial z/\partial\sigma=\epsilon$.</p><p><strong>Watch for:</strong> randomness is moved, not removed.</p>`,
      R`<p><strong>Concept:</strong> ELBO as a lower bound with a KL gap.</p><p><strong>Pattern:</strong> $\log p(x)=\mathrm{ELBO}+D_{KL}(q\Vert p(z|x))$; since KL $\ge0$ the bound holds; maximising over $\phi$ shrinks the gap.</p><p><strong>Watch for:</strong> Jensen applies to the concave log, so the direction is $\log E\ge E\log$.</p>`,
      R`<p><strong>Concept:</strong> sampleable latent space.</p><p><strong>Pattern:</strong> reconstruction alone does not constrain where codes lie; a prior-matching term (KL) fills gaps so that prior samples decode well.</p><p><strong>Watch for:</strong> prior matching is the key difference from a plain AE.</p>`,
      R`<p><strong>Concept:</strong> inverse-transform sampling $x=F^{-1}(u)$.</p><p><strong>Pattern:</strong> set $u=F(x)$, solve for $x$; for the exponential $x=-\ln(1-u)/\lambda$.</p><p><strong>Watch for:</strong> $u=0.5$ returns the median; do not forget to divide by the rate.</p>`,
      R`<p><strong>Concept:</strong> rejection sampling efficiency $=1/M$.</p><p><strong>Pattern:</strong> find the smallest $M$ with $p\le Mq$; acceptance rate is $1/M$; expected proposals per sample is $M$.</p><p><strong>Watch for:</strong> $M$ explodes with dimension.</p>`,
      R`<p><strong>Concept:</strong> $\beta$ trade-off in VAEs.</p><p><strong>Pattern:</strong> consider the extremes: large $\beta$ means codes ignore $x$ (collapse, blur), small $\beta$ means a plain AE (poor sampling).</p><p><strong>Watch for:</strong> a powerful decoder can bypass $z$ (posterior collapse).</p>`,
    ],
    short: [
      R`<p><strong>Concept:</strong> pointwise maximisation of $a\log D+b\log(1-D)$.</p><p><strong>Pattern:</strong> maximise the integrand per $x$ (set the derivative to 0): $D=a/(a+b)$; substitute equal densities to get 1/2 and $-\log4$.</p><p><strong>Watch for:</strong> value $-\log4$ corresponds to a JS divergence of 0.</p>`,
      R`<p><strong>Concept:</strong> comparing generative families.</p><p><strong>Pattern:</strong> cover the same axes for both: sharpness, stability, coverage, inference; tie each to its objective (adversarial vs likelihood bound).</p><p><strong>Watch for:</strong> blur comes from the MSE/Gaussian likelihood averaging possibilities.</p>`,
      R`<p><strong>Concept:</strong> negative ELBO.</p><p><strong>Pattern:</strong> write reconstruction plus KL, name each term's job, and tie the likelihood to the loss form (Gaussian gives MSE, Bernoulli gives BCE).</p><p><strong>Watch for:</strong> KL is the per-sample posterior against the prior, not between datasets.</p>`,
      R`<p><strong>Concept:</strong> generative models learn the training distribution's support.</p><p><strong>Pattern:</strong> ask whether the requested output lies in the training data's variations; if not, expect failure or collapse to the nearest seen modes.</p><p><strong>Watch for:</strong> fix via data, augmentation or conditioning.</p>`,
    ],
    long: [
      [
        R`<p><strong>Concept:</strong> converting $\log\sigma^2$ to $\sigma$ and sampling.</p><p><strong>Pattern:</strong> $\sigma=\exp(\tfrac12\log\sigma^2)$, then $z=\mu+\sigma\epsilon$.</p><p><strong>Watch for:</strong> the factor $\tfrac12$ when the net outputs log-variance.</p>`,
        R`<p><strong>Concept:</strong> pathwise gradients.</p><p><strong>Pattern:</strong> differentiate $z=\mu+\sigma\epsilon$ treating $\epsilon$ as a constant.</p><p><strong>Watch for:</strong> sampling from a distribution is not itself a differentiable op.</p>`,
        R`<p><strong>Concept:</strong> Gaussian KL formula.</p><p><strong>Pattern:</strong> $-\tfrac12(1+\log\sigma^2-\mu^2-\sigma^2)$; compute $\sigma^2=e^{\log\sigma^2}$ first.</p><p><strong>Watch for:</strong> the result is nonnegative; a negative answer signals an arithmetic slip.</p>`,
        R`<p><strong>Concept:</strong> regulariser vs data term.</p><p><strong>Pattern:</strong> find the minimiser of KL alone ($\mu=0,\sigma=1$), then explain what is lost (information about $x$).</p><p><strong>Watch for:</strong> the optimum balances both terms.</p>`,
        R`<p><strong>Concept:</strong> variational lower bound by Jensen.</p><p><strong>Pattern:</strong> insert $q/q$ in the marginal, write it as an expectation under $q$, apply Jensen for the concave log, split into reconstruction and KL; the gap is the KL to the true posterior.</p><p><strong>Watch for:</strong> state the direction of Jensen and which KL is the gap.</p>`,
      ],
    ],
  };
})();
