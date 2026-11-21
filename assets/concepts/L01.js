(function () {
  const R = String.raw;
  (window.QB_CONCEPTS = window.QB_CONCEPTS || {})["L01"] = [
    { h: R`What computer vision actually is`, t: "def", b: R`<p>A colour image reaches the machine as an $H\times W\times 3$ array of numbers (R, G, B). A human shown the same array cannot recognise anything in it, which is exactly the position of the computer.</p>
<p><strong>Computer vision</strong> = take that matrix as input and produce <em>semantic meaning</em> as output. Image understanding, image analysis, machine perception and machine vision are the same thing under different names.</p>
<p>The professor's stated aim for the course: understand the <strong>theory of deep learning</strong> and, more than theory, how things behave in the <strong>data-driven setup</strong> (PyTorch, Colab, assignments, a mini project).</p>` },
    { h: R`The semantic gap`, t: "def", b: R`<p><strong>Semantic gap</strong> = the gap between what a human sees and understands instantly and what the machine holds in memory while processing: raw pixel values.</p>
<p>The professor's beach example: you say "beach" because of sand, waves, shoreline, but that is only <em>one</em> image of millions in the "beach" category, and none of those concepts are what the machine reads. Writing code for this is the challenge.</p>` },
    { h: R`Why hand-written rules fail`, t: "exam", b: R`<p>The green-apple recogniser built from rules:</p>
<ol><li>detect edges,</li><li>dominant colour must be green,</li><li>contour must be roughly circular.</li></ol>
<table><tr><th>Input</th><th>Rules say</th><th>Error</th></tr>
<tr><td>Green ball</td><td>apple</td><td>false positive</td></tr>
<tr><td>Red apple</td><td>not apple</td><td>false negative</td></tr>
<tr><td>Cut / halved apple, new viewpoint</td><td>not apple</td><td>false negative</td></tr>
<tr><td>Whole green apple, front-on</td><td>apple</td><td>correct (the case the rules were written for)</td></tr></table>
<p>The same class must be recognised under every viewpoint and appearance. Rules cannot enumerate this, which motivates <em>learning</em> from data.</p>` },
    { h: R`Context: the professor's four demonstrations`, b: R`<ul>
<li><strong>Monsters / cars in perspective</strong>: identical objects look different in size because the road, corridor and buildings supply a depth cue. Remove the background and you see "three identical cars". Depth perception comes from context.</li>
<li><strong>Adelson's checker shadow (1990)</strong>: patch A looks black and B looks white, but they have the <em>same grey value</em>. A machine given the two pixels cannot tell them apart; a human is "right" only by using context (the shadow).</li>
<li><strong>Jigsaw puzzle</strong>: the first piece is hardest because there is no context; once you have a context window (corners, neighbours) matching gets easy.</li>
<li><strong>Zoomed train</strong>: a tiny crop was guessed as bottle, vase, ship, mask; the wider window shows a steam train at a Paris station. Context carries a huge amount of information.</li>
</ul>` },
    { h: R`Local features versus context`, t: "exam", b: R`<p><strong>Classical (old) vision</strong> dropped context because it is very hard to model, and kept only the object ("objects look similar wherever they are kept"). Features computed from the object region alone are called <strong>local features</strong>. This approach hit a performance ceiling.</p>
<p><strong>Deep models</strong> are trained on whole images, so context is fed in during training; they can exploit it through large receptive fields.</p>
<p>Caveat worth remembering: a model that uses context can also pick up <em>spurious</em> context (for example, background correlated with the label).</p>` },
    { h: R`Why vision is hard: 3D to 2D`, b: R`<p>A photograph projects the 3D world onto a 2D plane. Under a pinhole camera with focal length $f$, an object of height $H$ at depth $Z$ has image height</p>
$$h=\frac{fH}{Z}.$$
<p>Depth $Z$ is lost, so only the ratio $H/Z$ is observed. Worked example: a 2 m person at $Z=10$ m and a 1 m person at $Z=5$ m give the same $h$ ($H/Z=0.2$ in both cases).</p>
<p>Consequences: <strong>scale ambiguity</strong>, <strong>occlusion</strong>, <strong>viewpoint variation</strong>. The machine does not know what is in front, what is behind, or what is background; it sees pixels.</p>` },
    { h: R`Timeline of computer vision`, t: "exam", b: R`<table><tr><th>Period</th><th>Event</th></tr>
<tr><td>1966</td><td>Minsky's Summer Vision Project (MIT): an undergraduate (Gerald Sussman) asked to connect a camera and describe the scene. Turned out to be the most difficult problem; Sussman left the area.</td></tr>
<tr><td>1970s</td><td>Synthetic blocks/cuboids, edge-following recognition</td></tr>
<tr><td>1978</td><td>Kaneko: <strong>image parsing</strong> (tree / building / sky regions), i.e. segmentation</td></tr>
<tr><td>1980s-90s</td><td>Backprop and LeCun's CNNs appear but the vision community ignores them</td></tr>
<tr><td>1990s</td><td>Face recognition era for biometrics: Eigenfaces, Viola-Jones, neural-net face detectors</td></tr>
<tr><td>2000-2010</td><td>Digital cameras and the internet give many hand-crafted features (SIFT, HOG)</td></tr>
<tr><td>2012</td><td><strong>AlexNet</strong> (NeurIPS 2012) turns the vision community to deep learning</td></tr></table>` },
    { h: R`What changed in 2012 (and what did not)`, t: "pitfall", b: R`<p>The professor: "Backpropagation remains the same." The theory is old. What changed is:</p>
<ol><li><strong>data</strong>: vastly larger datasets,</li><li><strong>compute</strong>: GPUs,</li><li><strong>scaled-up architectures</strong> (deeper CNNs, later attention and transformers).</li></ol>
<p>Common mistakes:</p>
<ul><li>Saying AlexNet <em>invented</em> CNNs or backprop. LeCun's CNNs date from the 1990s; AlexNet showed they win at scale.</li>
<li>Saying the semantic gap is about image <em>resolution</em>. It is about pixels versus meaning, not about quality.</li>
<li>Saying context is irrelevant for machines. Adelson's illusion shows pixel values alone are ambiguous.</li></ul>
<p>Scope note: the course covers images and video, not LiDAR (a different modality).</p>` },
  ];
})();
