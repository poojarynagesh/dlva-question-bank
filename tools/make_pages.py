"""Generate the lecture pages and the lecture list from the table below.

Run after adding or editing a lecture:  python tools/make_pages.py

For each entry this writes lectures/Lxx.html, and it writes assets/lectures.js,
which the sidebar, the home page and the mock-paper generator all read. A new
lecture therefore needs only (1) a row here and (2) its bank assets/qb/Lxx.js.
See PLAN.md for the full workflow.
"""
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MIDTERM = "22 Sep 2026"

# (id, date, nav title, full title, lead, phase)  phase: "pre" = before the midterm, "post" = after
LECTURES = [
    ("L01", "4 Aug 2026", "Semantic gap & history of vision", "The Semantic Gap & a Brief History of Computer Vision",
     "Why vision is hard for machines: pixels versus meaning, the role of context, the 3D-to-2D projection, and sixty years of computer vision up to AlexNet.", "pre"),
    ("L02", "6 Aug 2026", "Visual cortex, Gabor & HMAX", "From Classical Vision to Deep Learning",
     "The two-module classical pipeline, the visual-cortex hierarchy (simple and complex cells, V1 to AIT), Gabor filters, and HMAX — a deep model that is not a deep learning model.", "pre"),
    ("L03", "11 Aug 2026", "Image classification, kNN & linear classifiers", "Image Classification, Nearest Neighbours & Linear Classifiers",
     "Challenges of classification, the data-driven approach, NN and kNN, hyperparameters and cross-validation, distance metrics, and the linear classifier f(x)=Wx+b.", "pre"),
    ("L04", "13 Aug 2026", "Loss functions & regularization", "Loss Functions: Hinge, Softmax / Cross-Entropy & Regularization",
     "Multi-class SVM (hinge) loss, cross-entropy after softmax, sanity checks at initialisation, non-uniqueness of W, and L1 versus L2 regularization.", "pre"),
    ("L05", "18 Aug 2026", "Optimization: GD, SGD, mini-batch", "Optimization: Gradient Descent, SGD & Mini-batch",
     "The optimisation objective, gradient descent, batch versus stochastic versus mini-batch updates, epochs and iterations, and the learning rate.", "pre"),
    ("L06", "20 Aug 2026", "Deep learning & CNN weight sharing", "Deep Learning & CNNs: Nonlinearity and Weight Sharing",
     "Why depth needs nonlinearity, the neuron model, and how local connectivity and weight sharing turn a fully connected layer into a convolution.", "pre"),
    ("L07", "25 Aug 2026", "PyTorch, autograd & conv arithmetic", "PyTorch, Autograd & Convolution Arithmetic",
     "Tensors and GPUs, computational graphs and backpropagation, a training loop, and counting output sizes, parameters and neurons in conv layers.", "pre"),
    ("L08", "27 Aug 2026", "Pooling, LeNet-5 & AlexNet", "Pooling, LeNet-5 & AlexNet",
     "Conv + activation as the mandatory core, max/average/L2 pooling, LeNet-5 and AlexNet layer by layer, where parameters and neurons live, and im2col.", "pre"),
    ("L09", "1 Sep 2026", "VGG, GoogLeNet & ResNet", "Feature Visualization, VGG, GoogLeNet & ResNet",
     "Deconvnet visualisation and transfer learning, ImageNet history, 3x3 stacks, 1x1 bottlenecks and global average pooling, and residual learning.", "pre"),
    ("L10", "3 Sep 2026", "Saliency maps & RNN taxonomy", "Explainability, Saliency Maps & Introduction to RNNs",
     "Gradient saliency, occlusion sensitivity, spurious correlations and weakly supervised detection; recurrent networks, weight sharing in time, and sequence taxonomies.", "pre"),
    ("L11", "8 Sep 2026", "Self-supervised learning", "Self-Supervised Learning",
     "Pretext tasks, linear probing versus fine-tuning, denoising and context encoders, jigsaw, rotation, colorization, contrastive learning (SimCLR), collapse and shortcuts.", "pre"),
    ("L12", "10 Sep 2026", "NeRF & 3D Gaussian Splatting", "Novel-View Synthesis: NeRF & 3D Gaussian Splatting",
     "Inverse graphics, structure from motion, differentiable rendering, NeRF volume rendering, 3D Gaussian primitives, splatting, alpha blending, density control and tile rasterization.", "pre"),
    ("L13", "15 Sep 2026", "RNN, LSTM, GRU & attention", "RNNs, LSTMs, GRUs & Attention",
     "Vanilla RNN equations, character language models, teacher forcing, BPTT, vanishing/exploding gradients, LSTM and GRU gates, and a first look at self-attention.", "pre"),
    ("L14", "24 Sep 2026", "Adversarial attacks & defenses", "Adversarial Attacks, Universal Perturbations & Defenses",
     "FGSM and PGD, universal and data-free perturbations, transferability, adversarial training as robust optimisation, fast adversarial training and quantization defenses.", "post"),
    ("L15", "29 Sep 2026", "Transformers & ViT", "Transformers, Self-Attention & Vision Transformers",
     "Tokens and positional encoding, scaled dot-product and multi-head attention, encoder and decoder blocks, causal masking, BERT versus GPT, and ViT.", "post"),
    ("L16", "1 Oct 2026", "GANs & VAEs", "Generative Models: GANs & Variational Autoencoders",
     "Sampling foundations, latent variables, autoencoders, the GAN minimax game and its failure modes, VAEs, the reparameterization trick and the ELBO.", "post"),
    ("L17", "13 Oct 2026", "Vision-language models (LLaVA)", "Vision-Language Models: LLaVA, Qwen-VL & Interpretability",
     "CLIP, BLIP, BLIP-2 and Flamingo recap, attention variants, LLaVA's architecture, data and two-stage training, Qwen-VL, and the logit lens.", "post"),
    ("L18", "15 Oct 2026", "3D reconstruction & foundation models", "3D Reconstruction: 3DGS, Feed-Forward & Foundation Models",
     "NeRF versus 3DGS, SfM initialisation, dynamic scenes, feed-forward and pose-free reconstruction, 3D foundation models, generative 3D, and the bitter lesson.", "post"),
    ("L19", "22 Oct 2026", "Flow matching", "Flow Matching & Flow Models",
     "DDPM recap and its limitations, the score, velocity fields, the flow-matching loss, ODE sampling and solvers, Reflow, and applications.", "post"),
]

TEMPLATE = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Lecture {n} · {short} — DLVA Question Bank</title>
<link rel="stylesheet" href="../assets/vendor/katex/katex.min.css">
<link rel="stylesheet" href="../assets/style.css">
<script defer src="../assets/vendor/katex/katex.min.js"></script>
<script defer src="../assets/vendor/katex/auto-render.min.js"></script>
<script defer src="../assets/search-index.js"></script>
<script defer src="../assets/lectures.js"></script>
<script defer src="../assets/qb/{id}.js"></script>
<script defer src="../assets/qbank.js"></script>
<script defer src="../assets/site.js"></script>
</head>
<body data-page="{id}" data-root="..">
<main class="content">

<div class="hero">
  <div class="kicker">Lecture {n} · {date}{phase}</div>
  <h1>{title}</h1>
  <p class="lead">{lead}</p>
  <div class="meta" id="qb-meta"></div>
</div>

<div class="box key">
  <span class="box-title">What to revise from this lecture</span>
  <div class="qb-points" id="qb-points"></div>
</div>

<p class="small muted">MCQs follow the paper's rule: <strong>at least one option is correct</strong> (unless marked single correct), with partial marks for an incomplete but correct selection and zero if any wrong option is chosen. For short and long questions, write your answer, reveal the model answer and mark yourself. Tags such as <em>scenario</em>, <em>trap</em>, <em>compute</em>, <em>design</em> and <em>interpret</em> show the skill each question tests.</p>

<div id="qbank"></div>

</main>
<script>
document.addEventListener("rl:ready", function () {{
  var b = window.QB_ALL && window.QB_ALL["{id}"]; if (!b) return;
  var m = 0; b.mcq.forEach(function (q) {{ m += q.pts; }});
  var w = 0; b.short.concat(b.long || []).forEach(function (q) {{ w += q.pts; }});
  document.getElementById("qb-meta").innerHTML =
    '<span class="chip">' + b.mcq.length + ' MCQs · ' + m + ' marks</span>' +
    '<span class="chip">' + b.short.length + ' short questions</span>' +
    ((b.long || []).length ? '<span class="chip">' + b.long.length + ' long question' + (b.long.length > 1 ? 's' : '') + '</span>' : '') +
    '<span class="chip">' + w + ' written marks</span>';
}});
</script>
</body>
</html>
"""


def short_date(d):
    day, mon, _ = d.split()
    return f"{mon} {int(day):02d}"


def counts(lid):
    """Question counts of a bank, read straight from its source."""
    path = ROOT / "assets" / "qb" / f"{lid}.js"
    if not path.exists():
        return None
    src = path.read_text(encoding="utf-8")
    c = {}
    for sec in ("mcq", "short", "long"):
        m = re.search(r"\n    " + sec + r":\s*\[(.*?)\n    \],", src, re.S)
        body = m.group(1) if m else ""
        c[sec] = body.count("parts:") if sec == "long" else len(re.findall(r"\{ pts:", body))
    return c


def main():
    out = ROOT / "lectures"
    out.mkdir(exist_ok=True)
    missing = []
    for lid, date, nav, title, lead, phase in LECTURES:
        if not (ROOT / "assets" / "qb" / f"{lid}.js").exists():
            missing.append(lid)
        page = TEMPLATE.format(id=lid, n=int(lid[1:]), date=date, title=html.escape(title), lead=html.escape(lead),
                               short=html.escape(nav), phase=" · after the midterm" if phase == "post" else "")
        (out / f"{lid}.html").write_text(page, encoding="utf-8")
    data = [{"id": lid, "date": date, "dateShort": short_date(date), "nav": nav, "title": title, "lead": lead, "phase": phase, "n": counts(lid)}
            for lid, date, nav, title, lead, phase in LECTURES]
    (ROOT / "assets" / "lectures.js").write_text(
        "// Generated by tools/make_pages.py — do not edit by hand.\n"
        f"window.DLVA_MIDTERM = {json.dumps(MIDTERM)};\n"
        f"window.DLVA_LECTURES = {json.dumps(data, ensure_ascii=False, indent=1)};\n", encoding="utf-8")
    print(f"wrote {len(LECTURES)} lecture pages and assets/lectures.js")
    if missing:
        print("WARNING: no question bank yet for", ", ".join(missing))


if __name__ == "__main__":
    main()
