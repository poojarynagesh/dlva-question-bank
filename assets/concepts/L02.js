(function () {
  const R = String.raw;
  (window.QB_CONCEPTS = window.QB_CONCEPTS || {})["L02"] = [
    { h: R`Why vision is hard: the brain's budget`, b: R`<p>About <strong>70% of the neurons</strong> in the human brain are devoted to visual processing; the other senses share the remaining 20-30%. If evolution spent that much on vision, it is no surprise that machine vision needs complex, resource-hungry solutions.</p>
<p>Biological vision is also not instantaneous: the whole hierarchy takes about <strong>200-250 ms</strong> from retina to recognition, even though it feels immediate.</p>` },
    { h: R`The classical two-module pipeline`, t: "def", b: R`<p>Before deep learning, recognition was built as:</p>
<p>raw input $\rightarrow$ <strong>Module 1: feature extraction</strong> (by a domain expert) $\rightarrow$ compact vector (about 100-1000 dims) $\rightarrow$ <strong>Module 2: ML classifier</strong> (SVM, random forest, NN) $\rightarrow$ label.</p>
<ul><li>Features are <strong>domain-specific</strong> and hand-crafted: SIFT, HOG for vision; MFCC for speech; parsing features / word vectors for NLP.</li>
<li>Classifiers are <strong>domain-agnostic</strong>: "give me a vector and a label".</li>
<li>Dimensionality reduction is needed because millions of pixels cannot be fed to the classifier directly.</li></ul>` },
    { h: R`The bottleneck: disjoint modules and "mix and match"`, t: "exam", b: R`<p>The two modules are <strong>disjoint: no communication between them</strong>. The features do not know what the classifier needs, and the classifier cannot influence the features. Accuracy hit a ceiling.</p>
<p>The professor's name for the 2000-2012 era: <strong>mix-and-match vision</strong>. With $N$ features and $M$ classifiers, researchers tried combinations and hoped for a good match. It is a crude, trial-and-error search.</p>
<p>Deep learning removes this split by learning features and classifier jointly, <strong>end-to-end</strong>, with gradients flowing through both.</p>` },
    { h: R`Visual cortex hierarchy`, t: "def", b: R`<p><strong>Simple cells</strong> look at a local neighbourhood and act like blob/dot detectors. <strong>Complex cells</strong> combine several simple cells, for example a run of dots becomes a <em>line</em>. Higher cells combine lines into shapes (triangle, square), then object parts, then objects. Complexity increases with level.</p>
<table><tr><th>Region</th><th>Role</th><th>CNN analogy</th></tr>
<tr><td>LGN</td><td>relay from retina</td><td>input</td></tr>
<tr><td>V1</td><td>edges, corners</td><td>first conv layer</td></tr>
<tr><td>V2</td><td>groups V1 features</td><td>second layer</td></tr>
<tr><td>V4</td><td>intermediate features</td><td>middle layers</td></tr>
<tr><td>PIT</td><td>complex shapes, parts</td><td>later conv layers</td></tr>
<tr><td>AIT</td><td>semantics: is there an object, which?</td><td>FC / output</td></tr></table>
<p>Order to remember: retina $\rightarrow$ LGN $\rightarrow$ V1 $\rightarrow$ V2 $\rightarrow$ V4 $\rightarrow$ PIT $\rightarrow$ AIT.</p>` },
    { h: R`Gabor filters`, t: "def", b: R`<p>A Gabor filter is a sinusoid under a Gaussian window:</p>
$$g(x,y)=\exp\!\Big(-\frac{x'^2+\gamma^2y'^2}{2\sigma^2}\Big)\cos\!\Big(2\pi\frac{x'}{\lambda}+\psi\Big),$$
<p>with $x'=x\cos\theta+y\sin\theta$, $y'=-x\sin\theta+y\cos\theta$.</p>
<ul><li><strong>Frequency</strong> ($1/\lambda$): high frequency picks out fine detail/edges, low frequency picks out smooth blobs.</li>
<li><strong>Spatial extent</strong> ($\sigma$): how large a region the filter covers.</li>
<li>$\theta$ sets orientation, so a bank of Gabors covers many orientations and scales.</li></ul>
<p>Why it matters: Gabor filters closely resemble V1 neuron responses, which is why neuroscience uses them. The professor also said the Gabor filter <em>optimally fills</em> the space-frequency plane (minimum joint uncertainty in space and frequency).</p>` },
    { h: R`HMAX (Serre, 2007)`, t: "exam", b: R`<p>A biologically inspired hierarchy that alternates:</p>
<p>Image $\rightarrow$ <strong>S1</strong> (simple layer, Gabor filters) $\rightarrow$ <strong>C1</strong> (complex layer, max pooling) $\rightarrow$ <strong>S2</strong> $\rightarrow$ <strong>C2</strong> $\rightarrow$ feature vector $\rightarrow$ classifier.</p>
<ul><li>S layers correspond to simple cells: filtering.</li><li>C layers correspond to complex cells: pooling (local max), giving tolerance to small shifts.</li></ul>
<p>It was among the top approaches before AlexNet. It is the precursor of the conv + pool pattern of CNNs.</p>` },
    { h: R`Deep model versus deep learning model`, t: "exam", b: R`<p>The single most important idea of the lecture. HMAX is a <strong>deep model but not a deep learning model</strong>: it has many hierarchical layers, but the filters are <strong>fixed</strong> (hand-designed Gabors), nothing is learned.</p>
<p>Make the filters <strong>variable</strong>: initialise them randomly, forward-pass images, and learn them by <strong>backpropagation</strong>. Now it is a deep learning model, which is what the rest of the course studies.</p>
<table><tr><th></th><th>HMAX (deep model)</th><th>CNN (deep learning)</th></tr>
<tr><td>Layers</td><td>hierarchical</td><td>hierarchical</td></tr>
<tr><td>Filters</td><td>fixed Gabor</td><td>learned by backprop</td></tr>
<tr><td>Feature design</td><td>manual, domain expert</td><td>data-driven</td></tr>
<tr><td>Feature-classifier link</td><td>none</td><td>gradient flows end-to-end</td></tr></table>` },
    { h: R`Common traps`, t: "pitfall", b: R`<ul>
<li>"Depth means deep learning": wrong. HMAX is deep (multi-layer) yet has no learning.</li>
<li>Confusing the roles: simple cells = local detectors of dots/blobs; complex cells = combine them (lines). In HMAX, S = filtering and C = pooling.</li>
<li>Thinking classifiers were the problem. The classifier was generic; the ceiling came from hand-crafted features designed with no feedback from the classifier.</li>
<li>Believing recognition is instant. It takes about 200 ms through the hierarchy.</li>
<li>What changed from classical to deep is <em>not</em> the hierarchy (that stayed) but that representations are learned.</li></ul>` },
  ];
})();
