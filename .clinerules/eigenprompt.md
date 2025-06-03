**Eigenprompt: Rigorous Code Generation & Project Initialization**

**Objective:** Generate [code for a specific function/module/class | architectural outline] for [project/feature description] with a focus on correctness, testability, and maintainability. Initialize project structure for prompt logging and documentation.

**I. Code Generation Specifications:**

    1.  **Functionality:** Clearly define the input(s), output(s), and expected behavior of the code.
    2.  **Language/Framework:** Specify [e.g., Python 3.10, JavaScript ES2022, Go 1.18, etc.].
    3.  **Dependencies:** List any required external libraries or modules.
    4.  **Error Handling:** Detail expected error conditions and handling mechanisms (e.g., specific exceptions, return codes).
    5.  **Performance Constraints (Optional):** Specify any critical time or memory limits.
    6.  **Code Style:** Adhere to [e.g., PEP 8 for Python, Google Java Style Guide]. Comments must be descriptive, explaining "why" for non-obvious logic and "what" for complex sections. Maximize clarity, minimize verbosity.

**II. Testing & Validation Requirements:**

    1.  **Unit Tests:**
        * Specify testing framework (e.g., `unittest` for Python, `Jest` for JS).
        * List critical test cases:
            * Valid inputs (typical cases).
            * Edge cases.
            * Invalid inputs & expected error handling.
        * Target minimum code coverage [%, if applicable].
    2.  **Validation Criteria:**
        * Define objective, measurable criteria for successful output/behavior.
        * Specify any datasets or methods for validation.

**III. Project Structure & Documentation (Initialize/Update):**

    1.  **`README.md`:**
        * **Project Title:**
        * **Description:** Concise summary of the project/module.
        * **Setup Instructions:** Steps to install dependencies and run.
        * **Usage:** How to use the generated code/module.
        * **Testing Instructions:** How to run tests.
    2.  **`prompts/` directory:**
        * Log this initial eigenprompt as `prompts/001_initial_eigenprompt.md`.
        * Log the LLM's full response (including code, README, etc.) as `prompts/001_response.md`.
        * Future interactions should be logged sequentially (e.g., `002_refinement_prompt.md`, `002_response.md`).

**IV. Output Format:**

    1.  Source code file(s) with specified naming (e.g., `module_name.py`).
    2.  Test file(s) with specified naming (e.g., `test_module_name.py`).
    3.  `README.md` content.
    4.  Confirmation of `prompts/` directory structure and initial log files.
    5.  Minimize conversational fluff. Output only requested artifacts and necessary confirmations.

---

**Example Usage Snippet (Illustrative - User provides this to the LLM based on the above eigenprompt):**

**Objective:** Generate code for a Python function that calculates the nth Fibonacci number efficiently, with memoization. Initialize project.

**I. Code Generation Specifications:**

    1.  **Functionality:** Input: non-negative integer `n`. Output: nth Fibonacci number. Implement memoization for efficiency.
    2.  **Language/Framework:** Python 3.10
    3.  **Dependencies:** None
    4.  **Error Handling:** Raise `ValueError` for negative input `n`.
    5.  **Code Style:** PEP 8. Descriptive comments for memoization logic.

**II. Testing & Validation Requirements:**

    1.  **Unit Tests:**
        * Framework: `unittest`
        * Test cases: `fib(0)` -> 0, `fib(1)` -> 1, `fib(10)` -> 55, `fib(20)` -> 6765, `fib(-1)` -> `ValueError`.
    2.  **Validation Criteria:** Output matches known Fibonacci sequence values. Performance improvement noticeable for larger `n` due to memoization (conceptual validation).

**III. Project Structure & Documentation (Initialize/Update):**

    1.  **`README.md`:** (Content as specified in eigenprompt section III.1)
    2.  **`prompts/` directory:** (Log this request and LLM response as specified)

**IV. Output Format:** `fibonacci.py`, `test_fibonacci.py`, `README.md` content, confirmation.