'use client'

import React, { useState } from 'react'
import PageHeader from '@/components/layout/PageHeader'
import {
  ChevronDown,
  ChevronUp,
  BrainCircuit,
  Cog,
  BarChart2,
  Tag,
  Search,
  Gamepad2,
  Shuffle,
  TrendingUp,
  Activity,
  GitFork,
  Scissors,
  Target,
  Network,
  Bot,
  Scale,
  Layers,
  TrendingDown,
  MountainSnow,
  LineChart,
  Hash,
  Table2,
  FlaskConical,
  Flame,
  Heart,
} from 'lucide-react'
import ReadAloudButton from '@/components/shared/ReadAloudButton'

type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced'
type Tab = 'Fundamentals' | 'Learning Types' | 'Algorithms' | 'Key Concepts' | 'Tools'

interface Card {
  id: string
  title: string
  icon: React.ComponentType<{ className?: string }>
  difficulty: Difficulty
  teaser: string
  explanation: string
  analogy: string
  useCase: string
  code?: string
  codeLang?: string
  tags?: string[]
}

const TABS: Tab[] = ['Fundamentals', 'Learning Types', 'Algorithms', 'Key Concepts', 'Tools']

const CONTENT: Record<Tab, Card[]> = {
  Fundamentals: [
    {
      id: 'ml-what',
      icon: BrainCircuit,
      title: 'What is Machine Learning?',
      difficulty: 'Beginner',
      teaser: 'Teaching computers to learn from data instead of explicit rules.',
      explanation:
        'Traditional programming: you write rules → computer applies them to data → output. ML flips this: you give data + expected outputs → computer learns the rules. ML is a subset of AI where models improve their performance on a task through experience (data), without being explicitly programmed for every case.',
      analogy:
        'Teaching a child to recognize dogs. You don\'t write a rule book ("4 legs, fur, barks"). You show 10,000 dog photos and say "dog" each time. The child learns the pattern. ML does the same with math.',
      useCase:
        'Email spam filters, Netflix recommendations, self-driving cars, voice assistants, fraud detection — all ML, not hand-coded rules.',
      tags: ['AI', 'Fundamentals'],
    },
    {
      id: 'ml-training',
      icon: Cog,
      title: 'Training vs Inference',
      difficulty: 'Beginner',
      teaser: 'Training teaches the model. Inference uses what it learned.',
      explanation:
        'Training: the model sees data and adjusts its internal parameters (weights) to minimize errors. This is expensive — can take hours or days on GPUs. Inference: you feed new, unseen data to the trained model and get a prediction. This is fast — milliseconds. You train once (or periodically), deploy, and infer millions of times.',
      analogy:
        'Training = studying for an exam (slow, intensive). Inference = actually taking the exam (fast, uses what you learned).',
      useCase:
        'You train a fraud detection model offline using months of transaction history. Then deploy it to flag transactions in real-time (inference) as customers make purchases.',
      tags: ['Pipeline', 'Fundamentals'],
    },
    {
      id: 'ml-data',
      icon: BarChart2,
      title: 'Datasets, Features, Labels & Models',
      difficulty: 'Beginner',
      teaser: 'The four building blocks of every ML problem.',
      explanation:
        'Dataset: collection of examples (rows). Feature: an input variable describing an example (e.g., email word count, sender domain). Label: the answer you want to predict (e.g., spam/not-spam). Model: the mathematical function that maps features → labels. Training teaches the model by adjusting internal parameters (weights/biases) until predictions match labels.',
      analogy:
        'Predicting house prices. Dataset = 10,000 houses sold. Features = size, location, bedrooms, age. Label = sale price. Model = the equation that predicts price from those features.',
      useCase: 'Every ML project starts by defining these four things. Getting them right matters more than choosing a fancy algorithm.',
      code: `# Typical dataset structure (pandas)
import pandas as pd

df = pd.read_csv('houses.csv')
# Features (X): inputs
X = df[['size_sqft', 'bedrooms', 'location_score']]
# Label (y): what we predict
y = df['sale_price']

print(X.shape)  # (10000, 3)  — 10k rows, 3 features
print(y.shape)  # (10000,)`,
      codeLang: 'python',
      tags: ['Data', 'Fundamentals'],
    },
  ],
  'Learning Types': [
    {
      id: 'ml-supervised',
      icon: Tag,
      title: 'Supervised Learning',
      difficulty: 'Beginner',
      teaser: 'Learn from labeled examples — input + correct answer pairs.',
      explanation:
        'The training data has both inputs (features) and correct outputs (labels). The model learns to map inputs to outputs by minimising the difference between its predictions and the true labels. Two main tasks: Classification (predict a category) and Regression (predict a number). Most real-world ML is supervised.',
      analogy:
        'A teacher grading homework. You see the question AND the correct answer, learn from mistakes, and improve over time.',
      useCase: 'Spam detection (spam/not-spam), house price prediction, image classification, medical diagnosis.',
      code: `from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

model = LogisticRegression()
model.fit(X_train, y_train)       # supervised: needs y_train labels

accuracy = model.score(X_test, y_test)
print(f"Accuracy: {accuracy:.2%}")`,
      codeLang: 'python',
      tags: ['Supervised'],
    },
    {
      id: 'ml-unsupervised',
      icon: Search,
      title: 'Unsupervised Learning',
      difficulty: 'Intermediate',
      teaser: 'Find hidden patterns in data — no labels needed.',
      explanation:
        'No labels. The model discovers structure by itself: clusters, associations, compressed representations. Main tasks: Clustering (group similar data), Dimensionality Reduction (simplify data), Anomaly Detection (find outliers). Harder to evaluate since there\'s no "correct answer" to compare against.',
      analogy:
        'Sorting a pile of foreign coins you\'ve never seen before. You group them by size, colour, and markings — without knowing the currency names.',
      useCase: 'Customer segmentation, topic modelling in documents, detecting unusual network traffic (intrusion detection), recommender systems.',
      code: `from sklearn.cluster import KMeans
import numpy as np

# Group customers into 3 segments
kmeans = KMeans(n_clusters=3, random_state=42)
kmeans.fit(customer_features)       # no labels needed

segments = kmeans.labels_           # [0, 2, 1, 0, 1, ...]
centers  = kmeans.cluster_centers_  # coordinates of each cluster`,
      codeLang: 'python',
      tags: ['Unsupervised'],
    },
    {
      id: 'ml-rl',
      icon: Gamepad2,
      title: 'Reinforcement Learning',
      difficulty: 'Advanced',
      teaser: 'Agent learns by trial and error, maximising cumulative reward.',
      explanation:
        'An agent interacts with an environment, takes actions, and receives rewards or penalties. It learns a policy (what action to take in each state) to maximise long-term reward. No pre-labelled dataset — learning comes from exploration and feedback. Computationally expensive.',
      analogy:
        'Teaching a dog new tricks with treats. The dog tries actions and learns which ones earn treats (reward) and which don\'t.',
      useCase: 'Game-playing AI (AlphaGo, Dota 2 bots), robot locomotion, autonomous driving, personalised content ranking.',
      tags: ['RL', 'Advanced'],
    },
    {
      id: 'ml-semi',
      icon: Shuffle,
      title: 'Semi-supervised & Self-supervised',
      difficulty: 'Intermediate',
      teaser: 'Get most of the supervised benefit with far fewer labels.',
      explanation:
        'Semi-supervised: small amount of labelled data + large amount of unlabelled data. The model learns structure from unlabelled data and refines with labels. Self-supervised: model generates its own labels from data (e.g., predict the next word in a sentence — no human labelling needed). GPT and BERT are trained self-supervisedly.',
      analogy:
        'Self-supervised = learning to read by predicting the next word in a book. Semi-supervised = learning from a few textbooks with annotations plus thousands without.',
      useCase: 'Large language models (GPT, BERT), image recognition with limited labels, medical imaging where labelling is expensive.',
      tags: ['Self-supervised', 'NLP'],
    },
  ],
  Algorithms: [
    {
      id: 'algo-linreg',
      icon: TrendingUp,
      title: 'Linear Regression',
      difficulty: 'Beginner',
      teaser: 'Fit a straight line through data to predict continuous values.',
      explanation:
        'Finds the best-fit line y = mx + b (or hyperplane in higher dimensions) that minimises Mean Squared Error. Simple, fast, interpretable. Works well when the relationship between features and target is roughly linear. Sensitive to outliers.',
      analogy: 'Drawing the best-fit straight line through a scatter plot by eye — but done mathematically.',
      useCase: 'Predicting house prices, sales forecasting, estimating delivery time.',
      code: `from sklearn.linear_model import LinearRegression

model = LinearRegression()
model.fit(X_train, y_train)

predictions = model.predict(X_test)
print(f"Coefficient: {model.coef_}")
print(f"Intercept:   {model.intercept_}")`,
      codeLang: 'python',
      tags: ['Regression', 'Classic'],
    },
    {
      id: 'algo-logreg',
      icon: Activity,
      title: 'Logistic Regression',
      difficulty: 'Beginner',
      teaser: 'Despite the name, it\'s a classification algorithm — outputs probabilities.',
      explanation:
        'Uses a sigmoid function to squish output between 0 and 1, interpreted as a probability. Decision boundary is linear. Fast, interpretable, good baseline for binary classification. Works poorly when classes aren\'t linearly separable.',
      analogy: 'A doctor estimating "probability this patient has diabetes" based on age, BMI, glucose level.',
      useCase: 'Spam/not-spam, disease prediction, credit risk scoring, click-through rate.',
      code: `from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report

model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
y_prob = model.predict_proba(X_test)[:, 1]  # probability of class 1

print(classification_report(y_test, y_pred))`,
      codeLang: 'python',
      tags: ['Classification', 'Classic'],
    },
    {
      id: 'algo-trees',
      icon: GitFork,
      title: 'Decision Trees & Random Forests',
      difficulty: 'Beginner',
      teaser: 'Decision trees split data on rules; forests combine many trees for accuracy.',
      explanation:
        'Decision Tree: splits data on feature thresholds to form a tree of if/else rules. Highly interpretable but prone to overfitting. Random Forest: trains many trees on random subsets of data and features, then averages predictions. Much more robust, handles non-linear patterns, works well out of the box.',
      analogy:
        'Decision tree = 20 questions game. Random forest = asking 100 different experts and taking the majority vote.',
      useCase: 'Credit scoring, medical diagnosis, feature importance ranking, any tabular data.',
      code: `from sklearn.ensemble import RandomForestClassifier

model = RandomForestClassifier(
    n_estimators=100,   # 100 trees
    max_depth=10,
    random_state=42
)
model.fit(X_train, y_train)

# Feature importance
importances = model.feature_importances_
for feat, imp in zip(feature_names, importances):
    print(f"{feat}: {imp:.3f}")`,
      codeLang: 'python',
      tags: ['Classification', 'Ensemble'],
    },
    {
      id: 'algo-svm',
      icon: Scissors,
      title: 'Support Vector Machine (SVM)',
      difficulty: 'Intermediate',
      teaser: 'Find the widest margin hyperplane that separates classes.',
      explanation:
        'SVM finds the decision boundary that maximises the margin (gap) between classes. Support vectors are the data points closest to the boundary. Kernel trick maps data into higher dimensions to find non-linear boundaries. Powerful in high-dimensional spaces but slow on large datasets.',
      analogy: 'Drawing a road between two groups of dots as wide as possible — keeping each group safely away from the road edges.',
      useCase: 'Text classification, image recognition (historically), bioinformatics, small-to-medium datasets.',
      code: `from sklearn.svm import SVC

model = SVC(kernel='rbf', C=1.0, gamma='scale')
model.fit(X_train, y_train)

# C: regularisation (lower = wider margin, more errors allowed)
# kernel: 'linear', 'rbf', 'poly'
score = model.score(X_test, y_test)`,
      codeLang: 'python',
      tags: ['Classification', 'Classic'],
    },
    {
      id: 'algo-kmeans',
      icon: Target,
      title: 'K-Means Clustering',
      difficulty: 'Beginner',
      teaser: 'Partition data into K groups by minimising within-cluster distance.',
      explanation:
        'Randomly initialise K centroids. Assign each point to nearest centroid. Recalculate centroids as group means. Repeat until stable. You choose K in advance (use elbow method or silhouette score to pick). Fast and scalable but assumes spherical clusters and struggles with outliers.',
      analogy: 'Organising a class of students into 3 study groups by seating them near whoever they\'re most similar to, then adjusting until everyone is closest to their own group\'s centre.',
      useCase: 'Customer segmentation, document clustering, image compression, anomaly detection.',
      code: `from sklearn.cluster import KMeans
import matplotlib.pyplot as plt

# Elbow method to choose K
inertias = []
for k in range(1, 11):
    km = KMeans(n_clusters=k, random_state=42, n_init=10)
    km.fit(X)
    inertias.append(km.inertia_)

# Use K where the curve elbows
optimal_k = 3
model = KMeans(n_clusters=optimal_k, random_state=42, n_init=10)
labels = model.fit_predict(X)`,
      codeLang: 'python',
      tags: ['Clustering', 'Unsupervised'],
    },
    {
      id: 'algo-nn',
      icon: Network,
      title: 'Neural Networks & Deep Learning',
      difficulty: 'Intermediate',
      teaser: 'Layers of interconnected nodes that learn complex non-linear patterns.',
      explanation:
        'A neural network has an input layer, one or more hidden layers, and an output layer. Each node applies a weighted sum + activation function (ReLU, sigmoid). Backpropagation adjusts weights using gradient descent. Deep Learning = many hidden layers. Powers image recognition (CNNs), language models (Transformers), and more.',
      analogy: 'Like a chain of filters. Raw image goes in → early layers detect edges → middle layers detect shapes → final layer says "cat".',
      useCase: 'Image classification, speech recognition, machine translation, text generation.',
      code: `import torch
import torch.nn as nn

class SimpleNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(10, 64),   # input 10 features
            nn.ReLU(),
            nn.Linear(64, 32),
            nn.ReLU(),
            nn.Linear(32, 1),    # output 1 value
            nn.Sigmoid()
        )

    def forward(self, x):
        return self.net(x)

model = SimpleNet()
criterion = nn.BCELoss()
optimizer = torch.optim.Adam(model.parameters(), lr=0.001)`,
      codeLang: 'python',
      tags: ['Deep Learning', 'Neural Net'],
    },
    {
      id: 'algo-transformers',
      icon: Bot,
      title: 'Transformers (Brief Intro)',
      difficulty: 'Advanced',
      teaser: 'Attention-based architecture behind GPT, BERT, and modern AI.',
      explanation:
        'Introduced in "Attention Is All You Need" (2017). Core idea: self-attention — each token attends to all others to understand context. Encoder transforms input into a representation; decoder generates output. BERT = encoder only (understanding). GPT = decoder only (generation). Very data- and compute-hungry, but generalize remarkably well.',
      analogy: 'Reading a sentence, but instead of reading word-by-word, you look at all words simultaneously and figure out which ones matter most for understanding each word.',
      useCase: 'ChatGPT, translation, summarisation, code generation, question answering.',
      code: `from transformers import pipeline

# Sentiment analysis with a pretrained transformer
classifier = pipeline("sentiment-analysis")
result = classifier("InterviewDump is a great platform!")
# [{'label': 'POSITIVE', 'score': 0.9998}]

# Text generation
generator = pipeline("text-generation", model="gpt2")
output = generator("The best way to prepare for interviews is", max_length=50)`,
      codeLang: 'python',
      tags: ['Deep Learning', 'NLP', 'Advanced'],
    },
  ],
  'Key Concepts': [
    {
      id: 'kc-overfit',
      icon: Scale,
      title: 'Overfitting vs Underfitting',
      difficulty: 'Beginner',
      teaser: 'The central bias-variance tradeoff in ML.',
      explanation:
        'Overfitting: model memorises training data, fails on new data (low train error, high test error). Underfitting: model too simple to learn the pattern (high train AND test error). Goal: generalisation — low error on unseen data. Fixes for overfitting: more data, regularisation (L1/L2), dropout, cross-validation. Fixes for underfitting: more features, more complex model, less regularisation.',
      analogy:
        'Overfitting = memorising past exam papers word-for-word instead of understanding the subject — you fail when questions are slightly different. Underfitting = not studying at all.',
      useCase: 'Always plot train vs validation error. If val error climbs while train error falls → overfitting. Stop early or regularise.',
      code: `# Detect with learning curves
from sklearn.model_selection import learning_curve
import numpy as np

train_sizes, train_scores, val_scores = learning_curve(
    model, X, y, cv=5, scoring='accuracy',
    train_sizes=np.linspace(0.1, 1.0, 10)
)

# If val_scores << train_scores at large sizes → overfitting
# If both are low → underfitting`,
      codeLang: 'python',
      tags: ['Core Concept'],
    },
    {
      id: 'kc-split',
      icon: Layers,
      title: 'Train / Validation / Test Split',
      difficulty: 'Beginner',
      teaser: 'Always hold out data you\'ve never seen to measure true performance.',
      explanation:
        'Train set (60–80%): model learns from this. Validation set (10–20%): tune hyperparameters and pick the best model. Test set (10–20%): final unbiased evaluation — touch only once. Never use the test set during development; it\'s your single honest measure of real-world performance.',
      analogy: 'Train = textbook. Validation = practice exam. Test = the real exam you can only sit once.',
      useCase: 'Prevents "data leakage" — accidentally optimising on test data and reporting inflated accuracy.',
      code: `from sklearn.model_selection import train_test_split

# Step 1: split off test set
X_temp, X_test, y_temp, y_test = train_test_split(
    X, y, test_size=0.15, random_state=42
)
# Step 2: split remaining into train + val
X_train, X_val, y_train, y_val = train_test_split(
    X_temp, y_temp, test_size=0.18, random_state=42
)
# Approx: 70% train, 15% val, 15% test`,
      codeLang: 'python',
      tags: ['Core Concept', 'Data'],
    },
    {
      id: 'kc-loss',
      icon: TrendingDown,
      title: 'Loss Functions',
      difficulty: 'Intermediate',
      teaser: 'The score the model minimises during training.',
      explanation:
        'A loss function measures how wrong the model\'s predictions are. Training tries to minimise it. Common losses: MSE (Mean Squared Error) for regression — penalises large errors heavily. Cross-Entropy Loss for classification — penalises confident wrong predictions heavily. Choosing the right loss is critical.',
      analogy: 'A penalty score in a game. The model adjusts its strategy (weights) each round to earn fewer penalties.',
      useCase: 'Custom loss functions are used in special cases — e.g., focal loss in object detection to focus on hard examples.',
      code: `import torch
import torch.nn as nn

# Regression
mse_loss = nn.MSELoss()
loss = mse_loss(predictions, targets)

# Binary classification
bce_loss = nn.BCEWithLogitsLoss()
loss = bce_loss(logits, targets.float())

# Multi-class classification
ce_loss = nn.CrossEntropyLoss()
loss = ce_loss(logits, targets)  # logits: (batch, num_classes)`,
      codeLang: 'python',
      tags: ['Training', 'Core Concept'],
    },
    {
      id: 'kc-gd',
      icon: MountainSnow,
      title: 'Gradient Descent',
      difficulty: 'Intermediate',
      teaser: 'The optimisation algorithm that minimises the loss by adjusting weights.',
      explanation:
        'Compute the gradient (slope) of the loss with respect to each weight. Step in the opposite direction (downhill) by a small amount (learning rate). Repeat. Variants: Batch GD (uses all data — slow), Stochastic GD (one sample at a time — noisy), Mini-batch GD (small batch — practical). Adam is the most popular adaptive optimiser.',
      analogy: 'Hiking down a mountain blindfolded. You feel the slope under your feet and always step downhill. Learning rate = how big each step is.',
      useCase: 'Used to train virtually every ML model — from linear regression to GPT-4.',
      code: `import torch.optim as optim

# Adam: adaptive learning rates per parameter
optimizer = optim.Adam(model.parameters(), lr=0.001)

for epoch in range(100):
    optimizer.zero_grad()        # clear old gradients
    output = model(X_train)
    loss = criterion(output, y_train)
    loss.backward()              # compute gradients
    optimizer.step()             # update weights`,
      codeLang: 'python',
      tags: ['Optimisation', 'Core Concept'],
    },
    {
      id: 'kc-metrics',
      icon: LineChart,
      title: 'Evaluation Metrics',
      difficulty: 'Beginner',
      teaser: 'Accuracy alone is misleading — know Precision, Recall, F1, and AUC.',
      explanation:
        'Accuracy: % correct — misleading on imbalanced datasets (99% "not fraud" is not a good fraud detector). Precision: of predicted positives, how many were correct? Recall: of actual positives, how many did we catch? F1: harmonic mean of precision and recall. AUC-ROC: model\'s ability to distinguish classes at all thresholds — 1.0 is perfect, 0.5 is random.',
      analogy: 'Imagine 1000 emails, 10 spam. A model that labels ALL as not-spam gets 99% accuracy but 0% recall on spam. Not useful. F1 and AUC reveal this.',
      useCase: 'Use F1 for imbalanced classes (fraud, cancer). Use AUC to compare models. Use Recall when missing a positive is catastrophic (cancer screening).',
      code: `from sklearn.metrics import (
    accuracy_score, precision_score,
    recall_score, f1_score, roc_auc_score
)

print(f"Accuracy:  {accuracy_score(y_test, y_pred):.3f}")
print(f"Precision: {precision_score(y_test, y_pred):.3f}")
print(f"Recall:    {recall_score(y_test, y_pred):.3f}")
print(f"F1 Score:  {f1_score(y_test, y_pred):.3f}")
print(f"AUC-ROC:   {roc_auc_score(y_test, y_prob):.3f}")`,
      codeLang: 'python',
      tags: ['Evaluation', 'Core Concept'],
    },
  ],
  Tools: [
    {
      id: 'tool-numpy',
      icon: Hash,
      title: 'NumPy',
      difficulty: 'Beginner',
      teaser: 'Fast numerical arrays — the foundation of all ML in Python.',
      explanation: 'NumPy provides n-dimensional arrays and vectorised math operations. Virtually every ML library (pandas, scikit-learn, PyTorch, TensorFlow) uses NumPy arrays internally. Essential for: matrix operations, reshaping data, broadcasting, and random number generation.',
      analogy: 'If Python lists are bicycles, NumPy arrays are racing cars — same basic shape, 100× faster for numbers.',
      useCase: 'Feature engineering, matrix math, storing datasets before model training.',
      code: `import numpy as np

arr = np.array([[1, 2, 3], [4, 5, 6]])
print(arr.shape)        # (2, 3)

# Vectorised ops — no Python loop needed
scaled = (arr - arr.mean()) / arr.std()   # standardise
dot    = arr @ arr.T                       # matrix multiply`,
      codeLang: 'python',
      tags: ['Library', 'Python'],
    },
    {
      id: 'tool-pandas',
      icon: Table2,
      title: 'Pandas',
      difficulty: 'Beginner',
      teaser: 'Excel-like DataFrames for loading, cleaning, and exploring data.',
      explanation: 'Pandas provides the DataFrame — a 2D table with labelled rows and columns. Essential for: loading CSV/JSON/SQL data, handling missing values, filtering/grouping/merging, feature engineering. The standard first step in any ML pipeline.',
      analogy: 'Pandas is your data\'s staging area — you clean, reshape, and explore before handing off to a model.',
      useCase: 'Load raw data, drop nulls, encode categoricals, merge tables, compute aggregations.',
      code: `import pandas as pd

df = pd.read_csv('data.csv')
df.head()

# Basic exploration
print(df.info())
print(df.describe())
print(df.isnull().sum())

# Feature engineering
df['age_bucket'] = pd.cut(df['age'], bins=[0,18,35,60,100],
                          labels=['teen','young','mid','senior'])`,
      codeLang: 'python',
      tags: ['Library', 'Python'],
    },
    {
      id: 'tool-sklearn',
      icon: FlaskConical,
      title: 'scikit-learn',
      difficulty: 'Beginner',
      teaser: 'The standard ML toolkit — 50+ algorithms, unified API.',
      explanation: 'scikit-learn (sklearn) provides: classification, regression, clustering, preprocessing, feature selection, evaluation metrics, pipelines, and cross-validation — all with the same fit/predict API. Best for traditional ML on tabular data. Not for deep learning (use PyTorch/TensorFlow for that).',
      analogy: 'A Swiss Army knife for classical ML — everything you need, consistent interface, well-documented.',
      useCase: 'Start every project here. Use it for baselines. Move to PyTorch/TF only when you need neural networks.',
      code: `from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import GradientBoostingClassifier

pipe = Pipeline([
    ('scaler', StandardScaler()),
    ('clf',    GradientBoostingClassifier(n_estimators=100))
])

pipe.fit(X_train, y_train)
score = pipe.score(X_test, y_test)`,
      codeLang: 'python',
      tags: ['Library', 'Python'],
    },
    {
      id: 'tool-pytorch',
      icon: Flame,
      title: 'PyTorch',
      difficulty: 'Intermediate',
      teaser: 'The research-favourite deep learning framework from Meta.',
      explanation: 'PyTorch uses dynamic computation graphs — you write normal Python, gradients are tracked automatically. More intuitive than TensorFlow for research. Dominant in academia. Production use increasing via TorchServe and TorchScript. Key components: Tensor (GPU array), autograd (auto differentiation), nn.Module (model building block), DataLoader (batched data).',
      analogy: 'PyTorch is like driving a manual car — more control, steeper learning curve, preferred by experts.',
      useCase: 'Custom neural architectures, research, fine-tuning language models, computer vision.',
      code: `import torch
import torch.nn as nn
from torch.utils.data import DataLoader, TensorDataset

# GPU if available
device = 'cuda' if torch.cuda.is_available() else 'cpu'

dataset = TensorDataset(torch.FloatTensor(X_train),
                        torch.FloatTensor(y_train))
loader  = DataLoader(dataset, batch_size=32, shuffle=True)

for X_batch, y_batch in loader:
    X_batch = X_batch.to(device)
    out  = model(X_batch)
    loss = criterion(out, y_batch)`,
      codeLang: 'python',
      tags: ['Library', 'Deep Learning'],
    },
    {
      id: 'tool-huggingface',
      icon: Heart,
      title: 'Hugging Face',
      difficulty: 'Intermediate',
      teaser: 'The GitHub of AI models — 500k+ pretrained models, one-line download.',
      explanation: 'Hugging Face Transformers library provides pretrained models (BERT, GPT-2, Llama, Mistral, etc.) you can use or fine-tune in a few lines. The Model Hub hosts 500k+ models and datasets. Hugely lowers the barrier to using state-of-the-art NLP, vision, and audio models.',
      analogy: 'Like npm for AI models — don\'t train from scratch, just install and use (or fine-tune).',
      useCase: 'Sentiment analysis, summarisation, translation, Q&A, text generation, image classification — all with pretrained models.',
      code: `from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

model_name = "distilbert-base-uncased-finetuned-sst-2-english"
tokenizer  = AutoTokenizer.from_pretrained(model_name)
model      = AutoModelForSequenceClassification.from_pretrained(model_name)

inputs  = tokenizer("This is great!", return_tensors="pt")
outputs = model(**inputs)
probs   = torch.softmax(outputs.logits, dim=1)
# tensor([[0.0012, 0.9988]])  → POSITIVE`,
      codeLang: 'python',
      tags: ['Library', 'NLP', 'Advanced'],
    },
  ],
}

const difficultyColors: Record<Difficulty, string> = {
  Beginner:     'text-green bg-green/10 border-green/20',
  Intermediate: 'text-amber bg-amber/10 border-amber/20',
  Advanced:     'text-red   bg-red/10   border-red/20',
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="bg-surface border border-border rounded-xl p-4 text-sm font-mono overflow-x-auto whitespace-pre-wrap mt-3">
      <code>{code}</code>
    </pre>
  )
}

function MLCard({ card }: { card: Card }) {
  const [open, setOpen] = useState(false)
  const Icon = card.icon

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden hover:border-indigo/30 transition-colors duration-200">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left p-5 flex items-start gap-4 focus:outline-none cursor-pointer"
      >
        <div className="w-9 h-9 rounded-xl bg-indigo-dim flex items-center justify-center flex-shrink-0 mt-0.5">
          <Icon className="w-4 h-4 text-indigo" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-sm font-semibold text-text">{card.title}</span>
            <span className={`text-[10px] font-mono border rounded-full px-2 py-0.5 ${difficultyColors[card.difficulty]}`}>
              {card.difficulty}
            </span>
            {card.tags?.map((t) => (
              <span key={t} className="text-[10px] font-mono text-text-dim bg-surface-hover border border-border rounded-full px-2 py-0.5">
                {t}
              </span>
            ))}
          </div>
          <p className="text-xs text-text-muted">{card.teaser}</p>
        </div>
        <div className="flex-shrink-0 text-text-dim mt-1">
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-border pt-4 space-y-4">
          <div className="flex justify-end">
            <ReadAloudButton text={[card.title, card.explanation, card.analogy].filter(Boolean).join('. ')} />
          </div>
          <div>
            <p className="text-xs font-mono text-text-dim uppercase tracking-widest mb-1">Explanation</p>
            <p className="text-sm text-text-muted leading-relaxed">{card.explanation}</p>
          </div>
          <div>
            <p className="text-xs font-mono text-text-dim uppercase tracking-widest mb-1">Real-world analogy</p>
            <p className="text-sm text-text-muted leading-relaxed italic">{card.analogy}</p>
          </div>
          <div>
            <p className="text-xs font-mono text-text-dim uppercase tracking-widest mb-1">When it&apos;s used</p>
            <p className="text-sm text-text-muted leading-relaxed">{card.useCase}</p>
          </div>
          {card.code && <CodeBlock code={card.code} />}
        </div>
      )}
    </div>
  )
}

export default function MLBasicsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Fundamentals')

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <PageHeader
        title="ML Basics"
        subtitle="From zero to understanding modern machine learning — concepts, algorithms, and tools explained clearly."
      />

      {/* Tab bar */}
      <div className="px-4 sm:px-6 py-4 border-b border-border flex flex-wrap gap-2 bg-bg">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer focus:outline-none ${
              activeTab === tab
                ? 'bg-indigo text-white'
                : 'bg-surface border border-border text-text-muted hover:border-indigo/40 hover:text-text'
            }`}
          >
            {tab}
            <span className="ml-2 text-[10px] font-mono opacity-60">
              {CONTENT[tab].length}
            </span>
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="px-4 sm:px-6 md:px-8 py-6 max-w-5xl w-full">
        <div className="flex flex-col gap-3">
          {CONTENT[activeTab].map((card) => (
            <MLCard key={card.id} card={card} />
          ))}
        </div>
      </div>
    </div>
  )
}
