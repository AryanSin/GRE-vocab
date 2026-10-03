# GRE Math Review — Complete Revision Notes

These notes summarize all the core theoretical concepts, definitions, rules, formulas, and ETS-specific conventions from the official **ETS GRE® Math Review**. Designed for rapid high-yield revision.

---

## Table of Contents
1. [Part 1: Arithmetic](#part-1-arithmetic)
   - [1.1 Integers](#11-integers)
   - [1.2 Fractions](#12-fractions)
   - [1.3 Exponents and Roots](#13-exponents-and-roots)
   - [1.4 Decimals](#14-decimals)
   - [1.5 Real Numbers](#15-real-numbers)
   - [1.6 Ratio](#16-ratio)
   - [1.7 Percent](#17-percent)
2. [Part 2: Algebra](#part-2-algebra)
   - [2.1 Algebraic Expressions](#21-algebraic-expressions)
   - [2.2 Rules of Exponents](#22-rules-of-exponents)
   - [2.3 Solving Linear Equations](#23-solving-linear-equations)
   - [2.4 Solving Quadratic Equations](#24-solving-quadratic-equations)
   - [2.5 Solving Linear Inequalities](#25-solving-linear-inequalities)
   - [2.6 Functions](#26-functions)
   - [2.7 Applications (Word Problems)](#27-applications-word-problems)
   - [2.8 Coordinate Geometry](#28-coordinate-geometry)
   - [2.9 Graphs of Functions](#29-graphs-of-functions)
3. [Part 3: Geometry](#part-3-geometry)
   - [3.1 Lines and Angles](#31-lines-and-angles)
   - [3.2 Polygons](#32-polygons)
   - [3.3 Triangles](#33-triangles)
   - [3.4 Quadrilaterals](#34-quadrilaterals)
   - [3.5 Circles](#35-circles)
   - [3.6 Three-Dimensional Figures](#36-three-dimensional-figures)
4. [Part 4: Data Analysis](#part-4-data-analysis)
   - [4.1 Methods for Presenting Data](#41-methods-for-presenting-data)
   - [4.2 Numerical Methods for Describing Data](#42-numerical-methods-for-describing-data)
   - [4.3 Counting Methods](#43-counting-methods)
   - [4.4 Probability](#44-probability)
   - [4.5 Distributions of Data, Random Variables & Normal Distribution](#45-distributions-of-data-random-variables--normal-distribution)
   - [4.6 Data Interpretation Strategies](#46-data-interpretation-strategies)

---

# Part 1: Arithmetic

### 1.1 Integers
- **Integers ($\mathbb{Z}$):** $\{\dots, -3, -2, -1, 0, 1, 2, 3, \dots\}$.
  - Positive integers: $> 0$
  - Negative integers: $< 0$
  - **$0$ is neither positive nor negative.**
- **Multiplication Signs:**
  - $(+) \times (+) = (+)$
  - $(-) \times (-) = (+)$
  - $(+) \times (-) = (-)$
- **Factors (Divisors) and Multiples:**
  - If $a = b \cdot c$ for integers $a, b, c$, then $b$ and $c$ are **factors (divisors)** of $a$, and $a$ is a **multiple** of $b$ and $c$.
  - Positive factors of $60$: $1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60$.
  - Negative factors also exist: e.g., $(-2) \times (-30) = 60$.
  - **$1$ is a factor of every integer;** $1$ is not a multiple of any integer except $1$ and $-1$.
  - **$0$ is a multiple of every integer** ($0 = 0 \cdot n$); $0$ is not a factor of any integer except $0$.
  - Every nonzero integer has infinitely many multiples.
- **LCM & GCD / GCF:**
  - **Least Common Multiple (LCM):** Smallest positive integer that is a multiple of both $c$ and $d$. (e.g., $\text{LCM}(30, 75) = 150$).
  - **Greatest Common Divisor (GCD / GCF):** Largest positive integer that is a divisor of both $c$ and $d$. (e.g., $\text{GCD}(30, 75) = 15$).
- **Division Algorithm (Quotient & Remainder):**
  - For integer $c$ and positive integer $d$:
    $$c = qd + r \quad \text{where } 0 \le r < d$$
    ($q =$ quotient, $r =$ remainder; both are integers).
  - Remainder $r$ is **always non-negative** and strictly less than divisor $d$.
  - If $c$ is divisible by $d$, remainder $r = 0$.
  - Division with negative dividend:
    - $-32 \div 3 = -11 \text{ R } 1$, because $-32 = (-11)(3) + 1$ (since $0 \le 1 < 3$).
    - $-13 \div 5 = -3 \text{ R } 2$, because $-13 = (-3)(5) + 2$.
    - $-73 \div 10 = -8 \text{ R } 7$, because $-73 = (-8)(10) + 7$.
- **Even and Odd Integers:**
  - **Even:** Divisible by $2$ ($\{\dots, -4, -2, 0, 2, 4, \dots\}$). **$0$ is even!**
  - **Odd:** Not divisible by $2$ ($\{\dots, -3, -1, 1, 3, \dots\}$). Remainder is $1$ when divided by $2$.
  - **Addition / Subtraction Rules:**
    - $\text{Even} \pm \text{Even} = \text{Even}$
    - $\text{Odd} \pm \text{Odd} = \text{Even}$
    - $\text{Even} \pm \text{Odd} = \text{Odd}$
  - **Multiplication Rules:**
    - $\text{Even} \times \text{Even} = \text{Even}$
    - $\text{Odd} \times \text{Odd} = \text{Odd}$
    - $\text{Even} \times \text{Odd} = \text{Even}$
    - *Tip:* The product of integers is odd **if and only if all factors are odd**. If at least one factor is even, the product is even.
- **Prime & Composite Numbers:**
  - **Prime Number:** Integer $> 1$ that has exactly two positive divisors: $1$ and itself.
    - First ten primes: $2, 3, 5, 7, 11, 13, 17, 19, 23, 29$.
    - **$1$ is NOT prime.**
    - **$2$ is the ONLY even prime number** (and the smallest prime).
  - **Composite Number:** Integer $> 1$ that is not prime (has $> 2$ positive divisors).
    - First ten composites: $4, 6, 8, 9, 10, 12, 14, 15, 16, 18$.
    - **$1$ is neither prime nor composite.**
  - **Prime Factorization (Fundamental Theorem of Arithmetic):**
    - Every integer $> 1$ is either prime or can be uniquely expressed as a product of prime powers.
    - e.g., $800 = 2^5 \cdot 5^2$; $1,155 = 3 \cdot 5 \cdot 7 \cdot 11$.

---

### 1.2 Fractions
- **Structure:** $\frac{c}{d}$ where numerator $c \in \mathbb{Z}$, denominator $d \in \mathbb{Z}, d \ne 0$. Also called rational numbers.
- **Equivalent Fractions:** Multiplying or dividing both numerator and denominator by nonzero $k$:
  $$\frac{c}{d} = \frac{c \cdot k}{d \cdot k}$$
- **Negative Signs:**
  $$\frac{-c}{d} = \frac{c}{-d} = -\frac{c}{d}, \quad \frac{-c}{-d} = \frac{c}{d}$$
- **Simplifying:** Divide numerator and denominator by their GCD.
- **Operations:**
  - **Addition / Subtraction:** Common denominator required.
    $$\frac{a}{b} \pm \frac{c}{d} = \frac{ad \pm bc}{bd}$$
  - **Multiplication:**
    $$\frac{a}{b} \times \frac{c}{d} = \frac{ac}{bd}$$
  - **Reciprocal:** The reciprocal of $\frac{a}{b}$ is $\frac{b}{a}$ ($a, b \ne 0$). A number times its reciprocal equals $1$.
  - **Division:** Multiply by the reciprocal of the divisor.
    $$\frac{a}{b} \div \frac{c}{d} = \frac{a}{b} \times \frac{d}{c} = \frac{ad}{bc}$$
  - **Mixed Numbers:** $4\frac{3}{8} = 4 + \frac{3}{8} = \frac{35}{8}$.
    - Note on negative mixed numbers: $-4\frac{3}{8} = -\left(4 + \frac{3}{8}\right) = -\frac{35}{8}$.

---

### 1.3 Exponents and Roots
- **Exponents:** $a^n = \underbrace{a \cdot a \cdot \dots \cdot a}_{n \text{ times}}$. Base $a$, exponent $n$.
- **Signs of Powers:**
  - $(\text{Negative})^{\text{even}} = \text{Positive}$ (e.g., $(-3)^2 = 9$).
  - $(\text{Negative})^{\text{odd}} = \text{Negative}$ (e.g., $(-3)^3 = -27$).
  - **Precedence Warning:** $(-3)^2 = 9$, but $-3^2 = -(3^2) = -9$.
- **Zero & Negative Exponents:**
  - For $a \ne 0$: $a^0 = 1$. ($0^0$ is undefined).
  - For $a \ne 0$: $a^{-1} = \frac{1}{a}$, $a^{-n} = \frac{1}{a^n}$.
- **Square Roots:**
  - A square root of $n \ge 0$ is a number $r$ such that $r^2 = n$.
  - Every positive number has **two** square roots (one positive, one negative).
  - **The Radical Sign Convention:** The symbol $\sqrt{n}$ **always designates the nonnegative square root** (principal root).
    - $\sqrt{16} = 4$ (NOT $-4$).
    - $\sqrt{0} = 0$.
    - Square roots of negative numbers are **not defined** in the real number system.
- **Rules of Square Roots ($a, b > 0$):**
  1. $(\sqrt{a})^2 = a$
  2. $\sqrt{a^2} = a$ (more generally, for any real $x$, $\sqrt{x^2} = |x|$)
  3. $\sqrt{a}\sqrt{b} = \sqrt{ab}$
  4. $\frac{\sqrt{a}}{\sqrt{b}} = \sqrt{\frac{a}{b}}$
  - **Trap:** $\sqrt{a + b} \ne \sqrt{a} + \sqrt{b}$!
- **Higher-Order Roots:**
  - **Odd-order roots ($\sqrt[3]{n}, \sqrt[5]{n}$):** Exactly **one real root** for every real number $n$ (positive, negative, or zero). e.g., $\sqrt[3]{-8} = -2$.
  - **Even-order roots ($\sqrt[4]{n}, \sqrt[6]{n}$):** Exactly **two real roots** for positive $n$, and **no real roots** for negative $n$.

---

### 1.4 Decimals
- **Place Values (Powers of 10):**
  - $\dots, 10^3 (\text{thousands}), 10^2 (\text{hundreds}), 10^1 (\text{tens}), 10^0 (\text{units}) \mathbf{.} 10^{-1} (\text{tenths}), 10^{-2} (\text{hundredths}), 10^{-3} (\text{thousandths}), \dots$
- **Terminating vs. Repeating Decimals:**
  - Every rational number $\frac{a}{b}$ produces either a **terminating** decimal (e.g., $\frac{1}{4} = 0.25$) or a **repeating** decimal (e.g., $\frac{1}{3} = 0.333\dots = 0.\overline{3}$, $\frac{1}{22} = 0.04545\dots = 0.0\overline{45}$).
  - *Divisibility Rule for Denominators:* A fully reduced fraction $\frac{a}{b}$ terminates if and only if the prime factorization of $b$ contains **only 2s and/or 5s**.
- **Rounding:** If the next digit is $\ge 5$, round up; if $< 5$, round down.

---

### 1.5 Real Numbers
- **Real Numbers ($\mathbb{R}$):** Rational numbers $\cup$ Irrational numbers.
  - **Rational:** Terminating or repeating decimals; can be written as $\frac{a}{b}$ with integers $a, b$ ($b \ne 0$).
  - **Irrational:** Non-terminating, non-repeating decimals (e.g., $\sqrt{2}, \sqrt{3}, \pi$).
- **Absolute Value:**
  $$|x| = \begin{cases} x & \text{if } x \ge 0 \\ -x & \text{if } x < 0 \end{cases}$$
  - Represents distance from 0 on the number line. $|x| \ge 0$ always.
- **Key Real Number Properties:**
  1. *Commutative:* $r + s = s + r$ and $rs = sr$
  2. *Associative:* $(r + s) + t = r + (s + t)$ and $(rs)t = r(st)$
  3. *Distributive:* $r(s + t) = rs + rt$
  4. *Identities:* $r + 0 = r$, $r \cdot 1 = r$, $r \cdot 0 = 0$
  5. *Zero Product Property:* If $rs = 0$, then $r = 0$, $s = 0$, or both.
  6. *Division by 0 is undefined.*
  7. If $r, s > 0 \implies r + s > 0$ and $rs > 0$.
  8. If $r, s < 0 \implies r + s < 0$ and $rs > 0$.
  9. If $r > 0, s < 0 \implies rs < 0$.
  10. **Triangle Inequality:** $|r + s| \le |r| + |s|$.
  11. Absolute Value Product/Quotient: $|rs| = |r||s|$ and $\left|\frac{r}{s}\right| = \frac{|r|}{|s|}$.
  12. **Squaring Behaviors:**
      - If $r > 1$, then $r^2 > r$ and $\sqrt{r} < r$.
      - If $0 < s < 1$, then $s^2 < s$ and $\sqrt{s} > s$.
      - If $-1 < t < 0$, then $t^2 > t$ and $t^2 < |t|$.

---

### 1.6 Ratio
- **Ratio:** Expresses relative size of quantities: $\frac{s}{t}$, $s \text{ to } t$, or $s : t$.
- **Simplifying:** Divide by common factors. Ratios behave like fractions.
- **Three-Part Ratios:** $a : b : c$. (Multiply or divide all terms by the same nonzero number).
- **Proportion:** Equation setting two ratios equal:
  $$\frac{a}{b} = \frac{c}{d} \iff ad = bc$$

---

### 1.7 Percent
- **Percent:** "Per hundred" ($x\% = \frac{x}{100} = 0.01x$).
  - **Trap:** $0.01 = 1\%$, but $0.01\% = \frac{0.01}{100} = 0.0001$.
- **Basic Relations:**
  - $\text{Percent} = \frac{\text{Part}}{\text{Whole}} \times 100\%$
  - $\text{Part} = \text{Decimal Equivalent} \times \text{Whole}$
  - $\text{Whole} = \frac{\text{Part}}{\text{Decimal Equivalent}}$
- **Percents Greater than 100%:** Part is greater than base whole (e.g., $250\% \text{ of } 16 = 2.5 \times 16 = 40$).
- **Percent Change (Increase / Decrease):**
  $$\text{Percent Change} = \frac{\text{Amount of Change}}{\text{Initial Base}} \times 100\% = \frac{\text{New} - \text{Original}}{\text{Original}} \times 100\%$$
  - Base is **always the initial value** before the change!
  - Percent Increase multiplier: $(1 + r/100)$. E.g., a $12\%$ increase $\implies \times 1.12$.
  - Percent Decrease multiplier: $(1 - r/100)$. E.g., a $20\%$ decrease $\implies \times 0.80$.
  - Doubling a quantity = **$100\%$ increase**.
- **Successive Percent Changes:**
  - **Never add percentages directly!** Multiply successive multipliers.
  - E.g., an $8\%$ decrease followed by a $6\%$ increase results in:
    $$\text{Final} = \text{Initial} \times (1 - 0.08) \times (1 + 0.06) = \text{Initial} \times 0.92 \times 1.06 = 0.9752 \times \text{Initial} \quad (-2.48\% \text{ net})$$

---

# Part 2: Algebra

### 2.1 Algebraic Expressions
- **Terminology:**
  - Term: product of numerical coefficient and variables raised to powers (e.g., $-7x^2 y$).
  - Polynomial: expression consisting of sum/difference of terms with nonnegative integer exponents.
  - Degree of term: sum of exponents of its variables.
  - Degree of polynomial: highest degree among its non-zero terms.
- **Operations:**
  - Add/subtract like terms (terms with identical variables to identical powers).
  - Multiply terms by multiplying coefficients and adding variable exponents.
- **Essential Algebraic Identities:**
  - $(a + b)^2 = a^2 + 2ab + b^2$
  - $(a - b)^2 = a^2 - 2ab + b^2$
  - $(a - b)(a + b) = a^2 - b^2$ *(Difference of Squares)*
  - $(a + b)(c + d) = ac + ad + bc + bd$ *(FOIL)*
  - *Note:* $a^2 + b^2$ cannot be factored over real numbers.

---

### 2.2 Rules of Exponents
For nonzero real bases $x, y$ and real exponents $a, b$:
1. $x^a \cdot x^b = x^{a+b}$
2. $\frac{x^a}{x^b} = x^{a-b}$
3. $(x^a)^b = x^{ab}$
4. $(xy)^a = x^a y^a$
5. $\left(\frac{x}{y}\right)^a = \frac{x^a}{y^a}$
6. $x^{-a} = \frac{1}{x^a}, \quad \left(\frac{x}{y}\right)^{-a} = \left(\frac{y}{x}\right)^a$
7. $x^0 = 1$ ($x \ne 0$)
8. **Fractional Exponents:** $x^{a/b} = (x^{1/b})^a = (\sqrt[b]{x})^a = \sqrt[b]{x^a}$ (for $x > 0$).

---

### 2.3 Solving Linear Equations
- **One Variable:** Standard form $ax + b = c$.
  - Equivalent equations maintained by: adding/subtracting same term, or multiplying/dividing both sides by nonzero constant.
- **Two Variables:** $Ax + By = C$. Graph is a straight line.
- **Systems of Two Linear Equations:**
  - Solved via **substitution** or **elimination**.
  - **Possible Number of Solutions:**
    1. **Unique solution:** Lines intersect at exactly 1 point (slopes differ).
    2. **No solution:** Inconsistent system; lines are parallel ($m_1 = m_2, b_1 \ne b_2$).
    3. **Infinitely many solutions:** Dependent system; lines are identical / coincident ($m_1 = m_2, b_1 = b_2$).

---

### 2.4 Solving Quadratic Equations
- **Standard Form:** $ax^2 + bx + c = 0$ ($a \ne 0$).
- **Factoring Method:** If $(x - r_1)(x - r_2) = 0$, then roots are $x = r_1$ and $x = r_2$.
- **Quadratic Formula:**
  $$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$
- **Discriminant ($D = b^2 - 4ac$):**
  - $D > 0$: **Two distinct real roots**
  - $D = 0$: **One real root** (repeated root / double root)
  - $D < 0$: **No real roots**

---

### 2.5 Solving Linear Inequalities
- **Inequality Signs:** $<, \le, >, \ge$.
- **Core Rule:**
  - Adding or subtracting any expression preserves the inequality sign.
  - Multiplying or dividing by a **positive** number preserves the inequality sign.
  - **Multiplying or dividing by a negative number REVERSES the inequality sign:**
    $$-2x < 6 \implies x > -3$$
- **Compound Inequalities:** $a \le f(x) < b$ means $a \le f(x)$ AND $f(x) < b$.

---

### 2.6 Functions
- **Definition:** A rule assigning to each input $x$ in domain exactly one output $f(x)$.
- **Domain:** All permissible inputs (denominators cannot be 0, radicands of even roots must be $\ge 0$).
- **Range:** All possible outputs resulting from domain values.
- **Piecewise Functions:** Functions defined by different formulas on distinct intervals.

---

### 2.7 Applications (Word Problems)
- **Averages:**
  $$\text{Sum} = \text{Average} \times N$$
- **Mixture Problems:**
  $$\text{Total Amount of Substance} = C_1 V_1 + C_2 V_2 = C_{\text{final}} (V_1 + V_2)$$
- **Rate and Distance:**
  - $d = r \cdot t, \quad r = \frac{d}{t}, \quad t = \frac{d}{r}$
  - **Average Speed:**
    $$\text{Average Speed} = \frac{\text{Total Distance}}{\text{Total Time}}$$
    *Never simply take the arithmetic mean of different speeds!*
- **Work Problems:**
  - If a worker completes a job in $t$ hours, rate of work $= \frac{1}{t}$ jobs/hour.
  - Combined rate of workers working together:
    $$\text{Combined Rate} = \frac{1}{t_1} + \frac{1}{t_2} = \frac{1}{t_{\text{together}}}$$
  - $\text{Work Done} = \text{Rate} \times \text{Time}$.
- **Interest:**
  - **Simple Interest:**
    $$I = P \cdot r \cdot t, \quad V = P(1 + rt)$$
    where $P$ is principal, $r$ is annual interest rate (in decimal), $t$ is time in years.
  - **Compound Interest:**
    $$V = P\left(1 + \frac{r}{100n}\right)^{nt}$$
    where $r\%$ is annual interest rate, $n$ is compounding frequency per year ($n=1$ annual, $n=2$ semiannual, $n=4$ quarterly, $n=12$ monthly), $t$ is years.

---

### 2.8 Coordinate Geometry
- **Rectangular Coordinate System ($xy$-plane):**
  - Origin $(0, 0)$, $x$-axis (horizontal), $y$-axis (vertical).
  - Quadrant I: $(+, +)$, Quadrant II: $(-, +)$, Quadrant III: $(-, -)$, Quadrant IV: $(+, -)$.
- **Distance Formula:**
  $$d = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$$
- **Midpoint Formula:**
  $$M = \left(\frac{x_1 + x_2}{2}, \frac{y_1 + y_2}{2}\right)$$
- **Slope of a Line:**
  $$m = \frac{y_2 - y_1}{x_2 - x_1} \quad (x_1 \ne x_2)$$
  - Positive slope: rises left-to-right.
  - Negative slope: falls left-to-right.
  - Zero slope ($m = 0$): horizontal line ($y = c$).
  - Undefined slope: vertical line ($x = c$).
- **Equations of Lines:**
  - **Slope-Intercept Form:** $y = mx + b$ ($m =$ slope, $b = y$-intercept).
  - **Point-Slope Form:** $y - y_1 = m(x - x_1)$.
  - **Standard Form:** $Ax + By = C$.
  - Intercepts: $x$-intercept set $y = 0$; $y$-intercept set $x = 0$.
- **Parallel & Perpendicular Lines:**
  - **Parallel Lines:** $m_1 = m_2$.
  - **Perpendicular Lines:** $m_1 \cdot m_2 = -1 \iff m_2 = -\frac{1}{m_1}$ (negative reciprocals).
- **Linear Inequalities in $xy$-Plane:**
  - Graph boundary line ($y = mx + b$).
  - Solid line for $\le, \ge$; dashed line for $<, >$.
  - Shade appropriate half-plane (test point $(0,0)$).
- **Symmetry:**
  - Symmetric with respect to $x$-axis: $(x, y) \to (x, -y)$.
  - Symmetric with respect to $y$-axis: $(x, y) \to (-x, y)$.
  - Symmetric with respect to origin: $(x, y) \to (-x, -y)$.
- **Circles in $xy$-Plane:**
  $$(x - h)^2 + (y - k)^2 = r^2$$
  Center $(h, k)$, radius $r$. Centered at origin: $x^2 + y^2 = r^2$.
- **Parabolas:**
  $$y = ax^2 + bx + c \quad (a \ne 0)$$
  - Opens upward if $a > 0$ (has minimum); downward if $a < 0$ (has maximum).
  - Axis of symmetry: $x = -\frac{b}{2a}$.
  - Vertex coordinates: $\left(-\frac{b}{2a}, f\left(-\frac{b}{2a}\right)\right)$.

---

### 2.9 Graphs of Functions
- **Graph of $f$:** The set of points $(x, f(x))$.
- **Vertical Line Test:** A curve in $xy$-plane represents a function if and only if no vertical line intersects it more than once.
- **Intersections:** Solving $f(x) = g(x)$ finds the $x$-coordinates of intersection points.
- **Graph Transformations ($c > 0$):**
  - **Vertical Shift:**
    - $y = f(x) + c \implies$ shift **up** by $c$ units
    - $y = f(x) - c \implies$ shift **down** by $c$ units
  - **Horizontal Shift:**
    - $y = f(x + c) \implies$ shift **left** by $c$ units
    - $y = f(x - c) \implies$ shift **right** by $c$ units
  - **Reflections:**
    - $y = -f(x) \implies$ reflect across **$x$-axis**
    - $y = f(-x) \implies$ reflect across **$y$-axis**
  - **Vertical Stretch / Shrink:**
    - $y = c f(x)$ with $c > 1 \implies$ vertical stretch by factor $c$
    - $y = c f(x)$ with $0 < c < 1 \implies$ vertical compression by factor $c$

---

# Part 3: Geometry

### 3.1 Lines and Angles
- **Angles:**
  - Acute: $0^\circ < \theta < 90^\circ$
  - Right: $\theta = 90^\circ$
  - Obtuse: $90^\circ < \theta < 180^\circ$
  - Straight: $\theta = 180^\circ$
- **Angle Relationships:**
  - **Complementary:** Angles sum to $90^\circ$.
  - **Supplementary:** Angles sum to $180^\circ$.
  - **Opposite (Vertical) Angles:** Congruent (equal).
- **Parallel Lines Cut by a Transversal:**
  - Corresponding angles are equal.
  - Alternate interior angles are equal.
  - Alternate exterior angles are equal.
  - Consecutive (same-side) interior angles are supplementary ($\theta_1 + \theta_2 = 180^\circ$).

---

### 3.2 Polygons
- **$n$-sided Convex Polygon:**
  - **Sum of interior angles:**
    $$(n - 2) \times 180^\circ$$
    - Triangle ($n=3$): $180^\circ$
    - Quadrilateral ($n=4$): $360^\circ$
    - Pentagon ($n=5$): $540^\circ$
    - Hexagon ($n=6$): $720^\circ$
  - **Sum of exterior angles (one per vertex):** Always **$360^\circ$** for any convex polygon.
- **Regular Polygon:** All sides equal (equilateral) and all angles equal (equiangular).
  - Each interior angle: $\frac{(n - 2) \times 180^\circ}{n}$
  - Each exterior angle: $\frac{360^\circ}{n}$

---

### 3.3 Triangles
- **Angle Sum:** Sum of interior angles is always $180^\circ$.
- **Exterior Angle Theorem:** Measure of an exterior angle equals the sum of the two remote (opposite) interior angles.
- **Triangle Inequality Theorem:** The length of any side must be:
  - Less than the sum of the other two sides: $c < a + b$
  - Greater than the positive difference: $c > |a - b|$
  $$|a - b| < c < a + b$$
- **Side-Angle Relationships:**
  - The longest side is opposite the largest angle.
  - The shortest side is opposite the smallest angle.
  - Equal sides are opposite equal angles.
- **Types by Sides:**
  - **Equilateral:** All sides equal; all angles $= 60^\circ$.
    - Area: $A = \frac{\sqrt{3}}{4} s^2$
    - Height: $h = \frac{\sqrt{3}}{2} s$
  - **Isosceles:** Two sides equal; angles opposite equal sides are equal (base angles).
  - **Scalene:** All three sides have different lengths.
- **Area of a Triangle:**
  $$A = \frac{1}{2} b h$$
  (Height $h$ is perpendicular distance from opposite vertex to base; can be inside, outside, or a side of the triangle).
- **Right Triangles & Pythagorean Theorem:**
  $$a^2 + b^2 = c^2 \quad (c \text{ is hypotenuse})$$
  - Common Pythagorean Triples: $3-4-5$, $5-12-13$, $8-15-17$, $7-24-25$, and their multiples.
- **Special Right Triangles:**
  - **$45^\circ-45^\circ-90^\circ$ (Isosceles Right):**
    - Side ratio: $1 : 1 : \sqrt{2}$
    - Legs $= x$, Hypotenuse $= x\sqrt{2}$
  - **$30^\circ-60^\circ-90^\circ$:**
    - Side ratio: $1 : \sqrt{3} : 2$
    - Side opposite $30^\circ = x$
    - Side opposite $60^\circ = x\sqrt{3}$
    - Hypotenuse (opposite $90^\circ$) $= 2x$
- **Congruent & Similar Triangles:**
  - **Congruence:** Same shape and size. Verified by: SSS, SAS, ASA, AAS.
  - **Similarity:** Same shape, proportional sides. Verified by: AA (or AAA), SAS, SSS.
  - **Ratio Relationships for Similar Triangles (Scale factor $k$):**
    - Ratio of side lengths $= k$
    - Ratio of perimeters $= k$
    - **Ratio of areas $= k^2$**

---

### 3.4 Quadrilaterals
- **Sum of interior angles:** $360^\circ$.
- **Parallelogram:** Opposite sides parallel and equal; opposite angles equal; consecutive angles supplementary; diagonals bisect each other.
  - $\text{Area} = b \cdot h$
- **Rectangle:** Parallelogram with four right angles. Diagonals are equal in length and bisect each other.
  - $\text{Area} = l \cdot w, \quad \text{Perimeter} = 2(l + w)$
- **Square:** Regular quadrilateral (all sides equal, four right angles). Diagonals are equal, perpendicular, and bisect each other.
  - $\text{Area} = s^2, \quad \text{Diagonal} = s\sqrt{2}$
- **Rhombus:** Parallelogram with four equal sides. Diagonals are perpendicular bisectors of each other.
  - $\text{Area} = b \cdot h = \frac{1}{2} d_1 d_2$
- **Trapezoid:** Quadrilateral with at least one pair of parallel sides (bases $b_1, b_2$).
  - $\text{Area} = \frac{1}{2}(b_1 + b_2)h$

---

### 3.5 Circles
- **Definitions:** Center $O$, radius $r$, diameter $d = 2r$.
  - Circumference: $C = 2\pi r = \pi d$
  - Area: $A = \pi r^2$
- **Chords:** Line segment connecting two points on circle. Diameter is the longest possible chord.
- **Arcs and Sectors (Central Angle $\theta$ in degrees):**
  - $\text{Arc Length} = \frac{\theta}{360^\circ} \times 2\pi r$
  - $\text{Sector Area} = \frac{\theta}{360^\circ} \times \pi r^2$
- **Tangents:**
  - A tangent line intersects the circle at exactly one point.
  - **A tangent line is perpendicular to the radius** drawn to the point of tangency.
- **Inscribed Triangles:**
  - If one side of an inscribed triangle is a **diameter** of the circle, the triangle is a **right triangle** (the angle opposite the diameter is $90^\circ$).
- **Concentric Circles:** Circles with different radii sharing the exact same center.

---

### 3.6 Three-Dimensional Figures
- **Rectangular Solid (Box):**
  - Dimensions: length $l$, width $w$, height $h$.
  - 6 rectangular faces, 12 edges, 8 vertices.
  - $\text{Volume} = l \cdot w \cdot h$
  - $\text{Surface Area} = 2(lw + lh + wh)$
  - **Space Diagonal:** $d = \sqrt{l^2 + w^2 + h^2}$
- **Cube:**
  - Rectangular solid where $l = w = h = s$.
  - $\text{Volume} = s^3$
  - $\text{Surface Area} = 6s^2$
  - **Space Diagonal:** $d = s\sqrt{3}$
- **Right Circular Cylinder:**
  - Circular bases with radius $r$, perpendicular height $h$.
  - $\text{Volume} = \pi r^2 h$
  - $\text{Lateral Surface Area} = 2\pi r h$
  - $\text{Total Surface Area} = 2\pi r^2 + 2\pi r h = 2\pi r(r + h)$

---

# Part 4: Data Analysis

### 4.1 Methods for Presenting Data
- **Variables:**
  - **Quantitative (Numerical):** Discrete (countable values, e.g., number of children) vs. Continuous (measurable intervals, e.g., height, time).
  - **Categorical (Non-numerical):** Qualitative classes (e.g., eye color, voting choice).
- **Distributions:**
  - **Frequency:** Count of occurrences.
  - **Relative Frequency:** $\frac{\text{Frequency}}{\text{Total Count}}$ (often expressed as percent).
- **Graphical Displays:**
  - **Bar Graph:** Bars separated by spaces; compares categories or discrete items. Segmented bar graphs show proportions within each bar.
  - **Histogram:** Bars touch; used for continuous data grouped into intervals (classes/bins). Area of bar is proportional to relative frequency.
  - **Circle Graph (Pie Chart):** Represents parts of a whole (100%). Central angle $= \text{Proportion} \times 360^\circ$.
  - **Scatterplot:** Displays bivariate data $(x, y)$. Shows correlation:
    - Positive correlation: $y$ tends to increase as $x$ increases.
    - Negative correlation: $y$ tends to decrease as $x$ increases.
    - Little/no correlation: no discernible linear trend.
  - **Time Series Graph:** Shows variable value plotted sequentially over time.
  - **Stem-and-Leaf Plot:** Separates data into "stems" (leading digits) and "leaves" (final digits). Shows frequency distribution while preserving individual data values.

---

### 4.2 Numerical Methods for Describing Data
- **Measures of Central Tendency:**
  1. **Arithmetic Mean (Average):**
     $$\bar{x} = \frac{x_1 + x_2 + \dots + x_n}{n}$$
  2. **Weighted Mean:**
     $$\bar{x}_w = \frac{\sum w_i x_i}{\sum w_i}$$
  3. **Median:** Middle value when numbers are sorted in ascending order.
     - Odd $n$: uniquely the $\frac{n+1}{2}$-th number.
     - Even $n$: arithmetic mean of the two middle numbers ($\frac{n}{2}$-th and $\left(\frac{n}{2}+1\right)$-th).
  4. **Mode:** Value(s) that appear with highest frequency. A list may have no mode, one mode, or multiple modes.
- **Measures of Position:**
  - **Quartiles:**
    - First Quartile ($Q_1$ / 25th percentile): median of lower half.
    - Second Quartile ($Q_2$ / 50th percentile): overall median.
    - Third Quartile ($Q_3$ / 75th percentile): median of upper half.
  - **Percentiles ($P_k$):** Value at or below which at least $k$ percent of the data falls.
- **Measures of Dispersion (Spread):**
  1. **Range:**
     $$\text{Range} = \text{Greatest Value} - \text{Least Value}$$
     - Highly sensitive to outliers.
  2. **Interquartile Range (IQR):**
     $$\text{IQR} = Q_3 - Q_1$$
     - Measures spread of middle $50\%$ of data; **resistant to outliers**.
  3. **Boxplot (Box-and-Whisker Plot):**
     - Five-Number Summary: $[\text{Least}, Q_1, Q_2, Q_3, \text{Greatest}]$.
     - Box spans $Q_1$ to $Q_3$; vertical line at median $Q_2$; whiskers extend to least and greatest data values.
  4. **Standard Deviation:**
     - Measures spread about the arithmetic mean.
     - Population Standard Deviation:
       $$\sigma = \sqrt{\frac{\sum (x_i - \mu)^2}{n}}$$
     - Sample Standard Deviation ($s$): divides by $n - 1$ instead of $n$.
     - **Properties of Standard Deviation:**
       - **Adding a constant $c$ to every value:** Mean increases by $c$; Standard Deviation remains **UNCHANGED**.
       - **Multiplying every value by positive constant $c$:** Mean is multiplied by $c$; Standard Deviation is **multiplied by $c$**.
       - More clustered around mean $\implies$ smaller standard deviation.
  5. **Standardization ($z$-Score):**
     $$z = \frac{x - \mu}{\sigma}$$
     - Measures how many standard deviations $x$ lies above ($z > 0$) or below ($z < 0$) the mean.
     - Standardizing converts mean to $0$ and standard deviation to $1$.
     - **Empirical Fact:** In *any* data distribution, **most data fall within $3$ standard deviations of the mean** (between $-3$ and $+3$).

---

### 4.3 Counting Methods
- **Sets:**
  - Empty set $\emptyset$ has no elements.
  - $A \subseteq B$: every element in $A$ is in $B$.
  - Disjoint (Mutually Exclusive): $A \cap B = \emptyset$.
  - **Inclusion-Exclusion Principle (Two Sets):**
    $$|A \cup B| = |A| + |B| - |A \cap B|$$
    $$\text{Total} = |A| + |B| - |A \cap B| + |\text{Neither}|$$
  - **Three Sets:**
    $$|A \cup B \cup C| = |A| + |B| + |C| - (|A \cap B| + |A \cap C| + |B \cap C|) + |A \cap B \cap C|$$
- **Multiplication Principle:**
  - If a first choice can be made in $n_1$ ways and a second independent choice in $n_2$ ways, total ways $= n_1 \times n_2 \times \dots \times n_k$.
- **Factorials:**
  $$n! = n \times (n - 1) \times \dots \times 2 \times 1, \quad 0! = 1$$
- **Permutations (Order Matters):**
  - Number of ways to arrange $k$ items selected from $n$ distinct items:
    $$P(n, k) = \frac{n!}{(n - k)!}$$
- **Combinations (Order Does NOT Matter):**
  - Number of unordered subsets of $k$ items selected from $n$ distinct items:
    $$\binom{n}{k} = \frac{n!}{k!(n - k)!}$$
  - Key identities:
    $$\binom{n}{k} = \binom{n}{n - k}, \quad \binom{n}{0} = \binom{n}{n} = 1, \quad \binom{n}{1} = n$$

---

### 4.4 Probability
- **Probability of an Event $E$:**
  $$P(E) = \frac{\text{Number of outcomes in } E}{\text{Total number of outcomes in sample space } S}$$
  (assuming all outcomes are equally likely).
- **Core Axioms:**
  - $0 \le P(E) \le 1$
  - $P(\emptyset) = 0$ (impossible event), $P(S) = 1$ (certain event).
- **Complement Rule:**
  $$P(\text{not } E) = 1 - P(E)$$
- **Addition Rule (General):**
  $$P(E \text{ or } F) = P(E) + P(F) - P(E \text{ and } F)$$
  - If $E$ and $F$ are **mutually exclusive** ($P(E \text{ and } F) = 0$):
    $$P(E \text{ or } F) = P(E) + P(F)$$
- **Multiplication Rule:**
  - If $E$ and $F$ are **independent** (occurrence of one has no effect on probability of the other):
    $$P(E \text{ and } F) = P(E) \times P(F)$$
  - If events are **dependent** (conditional probability):
    $$P(E \text{ and } F) = P(E) \times P(F \mid E)$$

---

### 4.5 Distributions of Data, Random Variables & Normal Distribution
- **Random Variables:** Variable whose values depend on chance outcomes.
  - Discrete random variable: countable outcomes on number line.
  - In a discrete probability distribution histogram, **the area of each bar is proportional to the probability** of that outcome. Total area $= 1$.
  - Uniform distribution: all outcomes equally likely; histogram is completely flat.
- **Continuous Probability Distribution:**
  - Area under the continuous density curve equals $1$.
  - Probability is represented by area under the curve across an interval: $P(a \le X \le b)$.
  - Probability at a single point is $0$: $P(X = c) = 0$.
- **The Normal Distribution:**
  - Symmetrical, bell-shaped distribution defined by mean $\mu$ (center) and standard deviation $\sigma$ (spread).
  - **Key Properties:**
    1. $\text{Mean} = \text{Median} = \text{Mode}$.
    2. Perfectly symmetrical about the mean.
    3. **68–95–99.7 Empirical Rule:**
       - $\approx \frac{2}{3}$ (approx $68.3\%$) of data lies within $\mu \pm 1\sigma$.
       - $\approx 95.4\%$ of data lies within $\mu \pm 2\sigma$.
       - $\approx 99.7\%$ (almost all) of data lies within $\mu \pm 3\sigma$.
       - Due to symmetry:
         - $P(X > \mu) = P(X < \mu) = 0.50$ ($50\%$).
         - $P(\mu < X < \mu + 1\sigma) \approx 34.1\%$.
         - $P(\mu + 1\sigma < X < \mu + 2\sigma) \approx 13.6\%$.
         - $P(X > \mu + 2\sigma) \approx 2.3\%$.
         - $P(X > \mu + 3\sigma) \approx 0.13\%$.
- **Standard Normal Distribution:**
  - Has mean $\mu = 0$ and standard deviation $\sigma = 1$.
  - Standardized via $z = \frac{X - \mu}{\sigma}$.

---

### 4.6 Data Interpretation Strategies
- **Step 1: Orient Before Answering:** Read title, axis titles, units, legends, and footnote notes before reading the questions.
- **Step 2: Percentage vs. Absolute Numbers Trap:**
  - A higher percentage does **not** necessarily mean a larger quantity if the base totals are different.
  - E.g., $10\%$ of $100,000$ ($10,000$) is much greater than $50\%$ of $1,000$ ($500$).
- **Step 3: Percent Change from Graphs:**
  $$\text{Percent Change} = \frac{\text{Value}_{\text{New}} - \text{Value}_{\text{Old}}}{\text{Value}_{\text{Old}}} \times 100\%$$
- **Step 4: Ratio Comparisons:** Ratios of percents can only be equated directly to ratios of counts if the percentages share the **exact same whole/base**.
- **Step 5: Estimation & Approximations:** When options are widely spaced, round figures to 2 significant digits to calculate mentally and save time.
