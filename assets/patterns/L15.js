(function () {
  const R = String.raw;
  (window.QB_PATTERNS = window.QB_PATTERNS || {})["L15"] = {
    mcq: [
      R`<p><strong>Concept:</strong> scaled dot-product attention $\mathrm{softmax}(qK^\top/\sqrt{d_k})V$.</p><p><strong>Pattern:</strong> (1) dot products, (2) divide by $\sqrt{d_k}$, (3) softmax, (4) weighted sum of values. Sanity check: weights sum to 1.</p><p><strong>Watch for:</strong> larger logits make softmax more peaked; the divisor here is $\sqrt2$, not 2.</p>`,
      R`<p><strong>Concept:</strong> variance of a sum of $d_k$ independent unit-variance products is $d_k$.</p><p><strong>Pattern:</strong> $\mathrm{Var}(q\cdot k)=d_k$, so dividing by $\sqrt{d_k}$ restores variance 1 and avoids softmax saturation.</p><p><strong>Watch for:</strong> a positive constant never changes the argmax, only sharpness.</p>`,
      R`<p><strong>Concept:</strong> self-attention is permutation-equivariant.</p><p><strong>Pattern:</strong> permute the input; outputs are permuted identically. Anything that pools (mean, max) is invariant; a token read without position information is likewise identical.</p><p><strong>Watch for:</strong> causal masks or positional encodings break the symmetry.</p>`,
      R`<p><strong>Concept:</strong> token count and attention cost of ViT.</p><p><strong>Pattern:</strong> tokens $=(H/P)^2(+1)$; attention matrix $n^2$; patch-embed params $P^2\cdot C\cdot d+d$; halving $P$ gives 4x tokens, about 16x attention cost.</p><p><strong>Watch for:</strong> include [CLS] when asked; bias term in parameter counts.</p>`,
      R`<p><strong>Concept:</strong> heads split $d_{model}$.</p><p><strong>Pattern:</strong> $d_k=d_{model}/h$; projections $W_Q,W_K,W_V,W^O$ total $4d_{model}^2$ regardless of $h$.</p><p><strong>Watch for:</strong> "more heads means more parameters" is false when $d_k$ shrinks accordingly.</p>`,
      R`<p><strong>Concept:</strong> causal mask: add $-\infty$ to scores above the diagonal.</p><p><strong>Pattern:</strong> for token $i$, softmax runs only over $j\le i$. Training is parallel via teacher forcing; generation is sequential.</p><p><strong>Watch for:</strong> parallel training does not imply parallel generation.</p>`,
      R`<p><strong>Concept:</strong> cross-attention source of Q, K, V.</p><p><strong>Pattern:</strong> Q from the stream that asks (decoder), K and V from the stream being read (encoder memory).</p><p><strong>Watch for:</strong> self-attention has all three from the same stream.</p>`,
      R`<p><strong>Concept:</strong> division of labour within a transformer block.</p><p><strong>Pattern:</strong> attention mixes across tokens; the FFN transforms each token independently; LayerNorm normalises across features per token.</p><p><strong>Watch for:</strong> LayerNorm is not BatchNorm (no batch dependence).</p>`,
      R`<p><strong>Concept:</strong> inductive bias vs data scale.</p><p><strong>Pattern:</strong> small data favours strong priors (CNN); huge data or SSL pretraining favours flexible models (ViT).</p><p><strong>Watch for:</strong> "always better" claims are false either way.</p>`,
      R`<p><strong>Concept:</strong> self-supervised pretraining objectives.</p><p><strong>Pattern:</strong> bidirectional masked prediction means an encoder for understanding; left-to-right next-token prediction means a decoder for generation.</p><p><strong>Watch for:</strong> the label source is the text itself in both.</p>`,
    ],
    short: [
      R`<p><strong>Concept:</strong> query-key matching, value mixing.</p><p><strong>Pattern:</strong> describe row $i$ in three steps: similarity, softmax weights summing to 1, weighted sum of values; mention learned projections.</p><p><strong>Watch for:</strong> keys decide where to look; values decide what is copied.</p>`,
      R`<p><strong>Concept:</strong> quadratic scaling of attention and resolution change.</p><p><strong>Pattern:</strong> tokens scale with area (doubling the side gives 4x), attention with tokens squared (16x). Position embeddings must be interpolated in 2-D.</p><p><strong>Watch for:</strong> parameters stay the same; only compute and memory change.</p>`,
      R`<p><strong>Concept:</strong> parallelism and teacher forcing.</p><p><strong>Pattern:</strong> if all inputs are known in advance and no step needs another step's output, compute all positions with one matrix multiplication.</p><p><strong>Watch for:</strong> at generation both models are sequential.</p>`,
      R`<p><strong>Concept:</strong> inductive bias.</p><p><strong>Pattern:</strong> list the priors each architecture builds in (locality, weight sharing, hierarchy) and link priors to data efficiency.</p><p><strong>Watch for:</strong> ViT scales better but needs data or pretraining.</p>`,
    ],
    long: [
      [
        R`<p><strong>Concept:</strong> $QK^\top$ with $Q=K=X$ is the Gram matrix.</p><p><strong>Pattern:</strong> entry $(i,j)=x_i\cdot x_j$; symmetric, the diagonal holds squared norms.</p><p><strong>Watch for:</strong> with learned $W_Q\ne W_K$ it is no longer symmetric.</p>`,
        R`<p><strong>Concept:</strong> row-wise scaled softmax.</p><p><strong>Pattern:</strong> divide the row by $\sqrt{d_k}$, exponentiate, normalise to sum 1.</p><p><strong>Watch for:</strong> softmax over each row (over keys), not columns.</p>`,
        R`<p><strong>Concept:</strong> output as weighted sum of values.</p><p><strong>Pattern:</strong> multiply the weight row by $V$; the result lies in the convex hull of the value vectors.</p><p><strong>Watch for:</strong> use rounded weights consistently.</p>`,
        R`<p><strong>Concept:</strong> causal masking.</p><p><strong>Pattern:</strong> drop keys $j\gt i$ before the softmax and renormalise over the remaining ones.</p><p><strong>Watch for:</strong> token 1 always has weight 1 on itself; mask before the softmax, not after.</p>`,
        R`<p><strong>Concept:</strong> permutation equivariance.</p><p><strong>Pattern:</strong> swapping inputs swaps the corresponding outputs; a token's output depends on the set of the others, not their order.</p><p><strong>Watch for:</strong> this is why positional information must be added explicitly.</p>`,
        R`<p><strong>Concept:</strong> complexity of attention.</p><p><strong>Pattern:</strong> score matrix $n\times n$ means $O(n^2d)$ time and $O(n^2)$ memory; substitute $n$ from the image and patch size.</p><p><strong>Watch for:</strong> cost is quadratic in tokens, but tokens are quadratic in resolution.</p>`,
      ],
    ],
  };
})();
