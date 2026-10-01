const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const money = (value) => `R ${Math.round(value).toLocaleString('en-ZA')}`;
const inputValue = (id) => Math.max(0, Number($(id)?.value) || 0);

const views = ['overview', 'chat', 'budget', 'goals', 'topics', 'quiz'];
function showView(view) {
  views.forEach((name) => $(`#${name}View`)?.classList.toggle('active-view', name === view));
  $$('[data-view]').forEach((button) => { if (button.classList.contains('nav-item') || button.classList.contains('chat-nav-icon')) button.classList.toggle('active', button.dataset.view === view); });
  const label = view === 'chat' ? 'Ask FinWise AI' : view === 'budget' ? 'Budget planner' : view === 'goals' ? 'Savings goals' : view === 'topics' ? 'Topic library' : view === 'quiz' ? 'Financial quiz' : 'Overview';
  $('#pageCrumb').textContent = label;
  $('#sidebar')?.classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
$$('[data-view]').forEach((button) => button.addEventListener('click', () => showView(button.dataset.view)));
$('#menuToggle').addEventListener('click', () => $('#sidebar').classList.toggle('open'));

const budgetInputs = ['incomeInput', 'housingInput', 'foodInput', 'transportInput', 'entertainmentInput', 'billsInput', 'otherInput', 'savingsInput'];
function updateBudget() {
  const income = inputValue('#incomeInput');
  const housing = inputValue('#housingInput');
  const food = inputValue('#foodInput');
  const transport = inputValue('#transportInput');
  const entertainment = inputValue('#entertainmentInput');
  const bills = inputValue('#billsInput');
  const other = inputValue('#otherInput');
  const saved = inputValue('#savingsInput');
  const expenses = housing + food + transport + entertainment + bills + other;
  const remaining = income - expenses - saved;
  const spentPercent = income ? (expenses / income) * 100 : 0;
  const savedPercent = income ? (saved / income) * 100 : 0;
  const remainingPercent = income ? (remaining / income) * 100 : 0;
  $('#overviewIncome').textContent = money(income);
  $('#overviewExpenses').textContent = money(expenses);
  $('#overviewSaved').textContent = money(saved);
  $('#overviewBalance').textContent = money(remaining);
  $('#budgetRemaining').textContent = money(remaining);
  $('#budgetExpenses').textContent = money(expenses);
  $('#budgetSaved').textContent = money(saved);
  $('#expensePercent').textContent = `${spentPercent.toFixed(1)}% of income`;
  $('#savingPercent').textContent = `${savedPercent.toFixed(1)}% of income`;
  $('#remainingPercent').textContent = `${Math.max(0, remainingPercent).toFixed(1)}%`;
  $('#remainingBar').style.width = `${Math.max(0, Math.min(100, remainingPercent))}%`;
  $('#donutTotal').textContent = money(expenses);
  $('#spentPercent').textContent = `${Math.round(spentPercent)}%`;
  const essential = income ? ((housing + food + transport + bills) / income) * 100 : 0;
  const wants = income ? ((entertainment + other) / income) * 100 : 0;
  $('#essentialAllocation').textContent = `${Math.round(essential)}%`;
  $('#wantAllocation').textContent = `${Math.round(wants)}%`;
  $('#saveAllocation').textContent = `${Math.round(savedPercent)}%`;
  $('#allocationBar').innerHTML = `<i style="width:${essential}%"></i><i style="width:${wants}%"></i><i style="width:${savedPercent}%"></i><i style="width:${Math.max(0, 100 - essential - wants - savedPercent)}%"></i>`;
  $('#allocationBar').children[0].style.background = 'var(--green)';
  $('#allocationBar').children[1].style.background = 'var(--coral)';
  $('#allocationBar').children[2].style.background = 'var(--purple)';
  $('#allocationBar').children[3].style.background = 'var(--yellow)';
  const essentialsTotal = housing + food + transport + bills;
  const wantsTotal = entertainment + other;
  const housingDeg = income ? (housing / income) * 360 : 0;
  const essentialsDeg = income ? (essentialsTotal / income) * 360 : 0;
  const wantsDeg = income ? (wantsTotal / income) * 360 : 0;
  $('#donutChart').style.background = `conic-gradient(var(--green) 0 ${housingDeg}deg, var(--coral) ${housingDeg}deg ${essentialsDeg}deg, var(--yellow) ${essentialsDeg}deg ${essentialsDeg + wantsDeg}deg, var(--blue) ${essentialsDeg + wantsDeg}deg 360deg)`;
  $('#spendingLegend').innerHTML = `<div><i class="legend-dot housing"></i><span>Housing</span><strong>${money(housing)}</strong></div><div><i class="legend-dot essentials"></i><span>Essentials</span><strong>${money(food + transport + bills)}</strong></div><div><i class="legend-dot lifestyle"></i><span>Lifestyle</span><strong>${money(entertainment)}</strong></div><div><i class="legend-dot other"></i><span>Other</span><strong>${money(other)}</strong></div>`;
}
budgetInputs.forEach((id) => $(`#${id}`).addEventListener('input', updateBudget));
$('#resetBudget').addEventListener('click', () => { const defaults = [8500, 2800, 900, 450, 500, 650, 600, 1200]; budgetInputs.forEach((id, index) => $(`#${id}`).value = defaults[index]); updateBudget(); });

function updateGoal() {
  const target = inputValue('#goalTarget'); const current = inputValue('#goalCurrent'); const months = inputValue('#goalMonths');
  const monthly = Math.max(0, target - current) / (months || 1); const percent = target ? Math.min(100, (current / target) * 100) : 0;
  $('#monthsOutput').textContent = `${months} month${months === 1 ? '' : 's'}`;
  $('#goalResultName').textContent = $('#goalName').value || 'My savings goal';
  $('#monthlyGoal').innerHTML = `${money(monthly)} <small>/ month</small>`;
  $('#weeklyGoal').textContent = `${money(monthly / 4.33)} per week`;
  $('#goalProgressPercent').textContent = `${Math.round(percent)}%`;
  $('#goalProgressBar').style.width = `${percent}%`;
  const future = new Date(); future.setMonth(future.getMonth() + months);
  $('#targetDate').textContent = `By ${future.toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' })}`;
}
['goalName', 'goalTarget', 'goalCurrent'].forEach((id) => $(`#${id}`).addEventListener('input', updateGoal));
$('#goalMonths').addEventListener('input', updateGoal); $('#calculateGoal').addEventListener('click', updateGoal);

const financeKnowledge = [
  { terms:['budget','budgeting','spending plan','50/30','5030'], answer:`A budget is a plan for your income before you spend it. Start with monthly income, subtract essential costs such as accommodation, food, transport and bills, then choose an amount for savings and flexible spending. If your expenses are higher than your income, reduce flexible costs first and review large fixed costs where possible.` },
  { terms:['emergency fund','emergency savings','rainy day'], answer:`An emergency fund is money reserved for unexpected essential costs, such as urgent transport, a medical expense or replacing something you need for work or study. A practical first target can be R1,000, then one month of essential expenses, and later several months if your circumstances allow it.` },
  { terms:['compound interest','compounding'], answer:`Compound interest is interest calculated on both the original amount and interest already added. If R1,000 grows by 5% in a year, it becomes R1,050. If the same rate applies again, the next year's growth is calculated on R1,050 rather than only the original R1,000.` },
  { terms:['save','saving','savings','student'], answer:`To build savings, choose a realistic amount and move it aside when income arrives rather than waiting to see what is left. Track spending for a week, identify one or two costs you can reduce, and keep savings separate from everyday spending. Consistency matters more than starting with a large amount.` },
  { terms:['need','needs','want','wants'], answer:`A need is something important for basic living, health, safety, study or work; a want is optional and mainly improves comfort or enjoyment. Context matters: mobile data could be a need for coursework but an upgraded entertainment subscription is usually a want.` },
  { terms:['debt','loan','borrow','borrowing'], answer:`Debt is money you borrow and must repay. Before borrowing, compare the interest rate, fees, repayment period and total amount repayable—not only the monthly instalment. Missing payments can add costs and may affect your credit record.` },
  { terms:['credit score','credit record','credit report'], answer:`A credit score is an indicator lenders may use alongside other information to assess credit risk. Your payment history, amount of credit used and other credit-record information can affect it. Paying agreed accounts on time and checking your credit report for errors are useful habits.` },
  { terms:['invest','investing','investment','shares','stocks'], answer:`Investing means putting money into assets with the aim of growing it over time, while accepting that values can rise or fall. Before investing, understand the risk, fees, timeframe and diversification. Money needed for near-term essentials is generally better kept accessible rather than exposed to investment volatility.` },
  { terms:['interest rate','interest'], answer:`Interest is either the cost of borrowing money or the return earned on some savings. For a loan, a higher rate generally increases the cost of repayment. For savings, a higher rate can increase growth, although the exact result depends on how often interest is calculated and any fees.` },
  { terms:['income','salary','wage'], answer:`Income is money you receive, for example from salary, wages, allowances, grants or side work. For budgeting, use the amount you can actually spend after deductions, then compare it with your expenses and savings goals.` },
  { terms:['expense','expenses','spending'], answer:`Expenses are the amounts you spend. It helps to separate fixed expenses, such as rent, from variable expenses, such as groceries or entertainment. Tracking both makes it easier to see where your money is going and what can realistically change.` },
  { terms:['inflation'], answer:`Inflation is a general rise in prices over time, which reduces what the same amount of money can buy. If your income or savings grow more slowly than prices, your purchasing power can fall.` },
  { terms:['tax','taxes','sars'], answer:`Tax is money collected by government under tax laws. In South Africa, the exact amount you owe depends on the type and amount of income and applicable rules. For a personal tax calculation or filing decision, use current SARS guidance or a qualified tax professional.` }
];

function escapeHTML(value){ return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
function normalise(text){ return text.toLowerCase().replace(/[?,.!]/g,' ').replace(/\s+/g,' ').trim(); }
function extractRands(text){ return [...text.matchAll(/(?:r\s*)?([0-9]+(?:[ ,.][0-9]{3})*(?:\.\d+)?)/gi)].map(m => Number(m[1].replace(/[ ,]/g,''))).filter(Number.isFinite); }
function getReply(text) {
  const lower = normalise(text);
  const amounts = extractRands(text);
  if ((/income|earn|salary/.test(lower)) && (/expense|spend|cost/.test(lower)) && amounts.length >= 2) {
    const left = amounts[0] - amounts[1];
    return left >= 0 ? `Using the figures you gave me, ${money(amounts[0])} − ${money(amounts[1])} leaves about ${money(left)}. Before treating all of that as available savings, check for irregular expenses, debt repayments and other commitments that were not included.` : `Using the figures you gave me, your expenses are about ${money(Math.abs(left))} more than your income. Review flexible spending first, then check whether any larger recurring costs can be reduced.`;
  }
  if ((/percent|percentage|%/.test(lower)) && amounts.length >= 2) {
    const pct = amounts[1] ? (amounts[0] / amounts[1]) * 100 : 0;
    return `${money(amounts[0])} is about ${pct.toFixed(1)}% of ${money(amounts[1])}.`;
  }
  let best = null, bestScore = 0;
  for (const item of financeKnowledge) {
    let score = 0;
    for (const term of item.terms) {
      if (lower.includes(term)) score += term.includes(' ') ? 3 : 2;
      else {
        const words = term.split(' ');
        score += words.filter(w => w.length > 3 && lower.includes(w)).length;
      }
    }
    if (score > bestScore) { bestScore = score; best = item; }
  }
  if (best && bestScore > 0) return best.answer;
  if (/hello|hi |^hi$|hey|good morning|good afternoon/.test(lower)) return `Hi! Ask me a question about budgeting, saving, debt, credit, interest, investing or another personal-finance concept and I’ll explain it in simple terms.`;
  if (/thank/.test(lower)) return `You’re welcome. You can ask a follow-up in your own words whenever you’re ready.`;
  return `I can answer general financial-literacy questions, but I don’t want to guess about “${escapeHTML(text)}”. Try adding a little more detail—for example, the money concept you mean or the numbers you want help calculating. I can help with budgeting, saving, expenses, debt, credit, interest, investing and basic money calculations.`;
}
function addMessage(text, isUser = false) {
  const messages = $('#messages');
  const wrapper = document.createElement('div');
  wrapper.className = `message ${isUser ? 'user-message' : 'bot'}`;
  const safeText = escapeHTML(text).replace(/\n/g,'<br>');
  wrapper.innerHTML = isUser ? `<div><p>${safeText}</p><span class="message-time">Now</span></div>` : `<div class="message-avatar">✦</div><div><p>${safeText}</p><span class="message-time">Now</span></div>`;
  messages.appendChild(wrapper);
  requestAnimationFrame(() => { messages.scrollTop = messages.scrollHeight; });
}
function askQuestion(text) { addMessage(text, true); setTimeout(() => addMessage(getReply(text)), 250); }
$('#chatForm').addEventListener('submit', (event) => { event.preventDefault(); const input = $('#chatInput'); const text = input.value.trim(); if (text) { askQuestion(text); input.value = ''; input.focus(); } });
$$('[data-question]').forEach((button) => button.addEventListener('click', () => { showView('chat'); askQuestion(button.dataset.question); }));

const topics = [{ title: 'Budgeting', desc: 'Give your money a simple plan.', symbol: '▤', detail: 'A budget is a plan for where your money goes each month.', example: 'If you receive R6,000, you might plan R3,000 for essentials, R1,800 for flexible spending and R1,200 for goals.', tips: ['Start with real numbers, not perfect ones.', 'Check your plan once a week.', 'Give every rand a role before it arrives.'], mistakes: 'Making a budget so strict that one surprise breaks the whole plan.' }, { title: 'Saving', desc: 'Build a cushion, one deposit at a time.', symbol: '✦', detail: 'Saving means setting money aside now for a future need or goal.', example: 'Saving R200 each month becomes R2,400 in a year, before any interest.', tips: ['Automate a small amount after payday.', 'Name your savings goal.', 'Celebrate consistency, not just big amounts.'], mistakes: 'Waiting to save whatever happens to be left at the end of the month.' }, { title: 'Expenses', desc: 'Understand where your money flows.', symbol: '↘', detail: 'An expense is money you pay for a product, service or activity.', example: 'Small purchases like snacks or delivery fees can become a meaningful monthly category.', tips: ['Track for seven days without judgement.', 'Separate fixed and flexible expenses.', 'Review subscriptions regularly.'], mistakes: 'Only tracking large expenses and missing the small patterns.' }, { title: 'Debt', desc: 'Borrowing, repayment and interest.', symbol: '◈', detail: 'Debt is money borrowed that must be repaid, usually with interest.', example: 'A R1,000 loan with interest will cost more than R1,000 in total repayments.', tips: ['Know the total cost, not only the instalment.', 'Pay on time to avoid extra fees.', 'Ask questions before signing.'], mistakes: 'Comparing loans only by the smallest monthly payment.' }, { title: 'Credit', desc: 'How borrowing history is understood.', symbol: '◇', detail: 'A credit score is an indicator built from parts of your credit history.', example: 'Regular on-time repayments can show a pattern of reliability.', tips: ['Check your report for errors.', 'Protect your personal information.', 'Never pay for a guaranteed score.'], mistakes: 'Assuming a score is the same as your bank balance.' }, { title: 'Investing basics', desc: 'Let your money work, with context.', symbol: '⌁', detail: 'Investing is putting money into assets that may grow over time, with risk.', example: 'A diversified investment spreads money across different assets rather than relying on one.', tips: ['Learn about fees and risk.', 'Think about your timeframe.', 'Ignore promises of guaranteed returns.'], mistakes: 'Investing money you need soon or following hype without research.' }, { title: 'Emergency funds', desc: 'A buffer for life’s surprises.', symbol: '☼', detail: 'An emergency fund is accessible money reserved for unexpected essential costs.', example: 'A broken laptop used for school may be an emergency; a sale item usually is not.', tips: ['Begin with a small first target.', 'Keep it separate from spending money.', 'Top it up after using it.'], mistakes: 'Using the emergency fund for planned expenses.' }, { title: 'Financial goals', desc: 'Turn intentions into next steps.', symbol: '◎', detail: 'A financial goal is a specific amount you want to reach by a chosen time.', example: 'R3,000 in six months is a clearer goal than “save more.”', tips: ['Use an amount and a date.', 'Break it into monthly or weekly steps.', 'Review your goal when life changes.'], mistakes: 'Choosing an inspiring goal without checking if the monthly amount is realistic.' }];
$('#topicGrid').innerHTML = topics.map((topic, index) => `<button class="topic-card" data-topic="${index}"><span class="topic-symbol">${topic.symbol}</span><h3>${topic.title}</h3><p>${topic.desc}</p></button>`).join('');
$$('[data-topic]').forEach((card) => card.addEventListener('click', () => { const topic = topics[card.dataset.topic]; $$('.topic-card').forEach((item) => item.classList.remove('selected')); card.classList.add('selected'); $('#topicDetail').innerHTML = `<div class="detail-content"><div><span class="pill">${topic.title.toUpperCase()}</span><h2>${topic.detail}</h2><p><strong>Example:</strong> ${topic.example}</p><p><strong>What to remember:</strong> You don’t need to know everything at once. A clear next step is progress.</p></div><div class="detail-list"><h3>Practical tips</h3><ul>${topic.tips.map((tip) => `<li>${tip}</li>`).join('')}</ul><h3>Common mistake</h3><p style="font-size:10px;color:#5d746c;line-height:1.45">${topic.mistakes}</p></div></div>`; }));

const quizQuestions = [{ topic: 'BUDGETING', question: 'What is the main purpose of a budget?', answers: ['To stop you spending completely', 'To give your money a clear plan', 'To make more money instantly', 'To avoid paying bills'], correct: 1, explanation: 'A budget is a plan that helps you make intentional choices with the money you have.' }, { topic: 'SAVING', question: 'Which is a helpful way to build a saving habit?', answers: ['Save only when you have a lot left', 'Keep savings secret from yourself', 'Set aside a small amount regularly', 'Borrow money to save'], correct: 2, explanation: 'Small, regular contributions build consistency and can add up over time.' }, { topic: 'INTEREST', question: 'What is interest on a loan?', answers: ['A reward for spending', 'The cost of borrowing money', 'A type of bank account', 'A financial goal'], correct: 1, explanation: 'Interest is generally the cost paid to borrow money, often shown as a rate.' }, { topic: 'NEEDS VS WANTS', question: 'Which is most likely a need?', answers: ['A new pair of trend shoes', 'A streaming upgrade', 'Basic transport to class', 'A second takeaway'], correct: 2, explanation: 'Needs support basic living, health or safety. Wants can be enjoyable but are usually optional.' }, { topic: 'EMERGENCY FUNDS', question: 'What is an emergency fund for?', answers: ['Planned birthday shopping', 'Unexpected essential costs', 'Investing in the latest trend', 'Daily snacks'], correct: 1, explanation: 'An emergency fund is a buffer for unexpected, important expenses.' }, { topic: 'DEBT', question: 'When comparing borrowing options, what should you check?', answers: ['Only the smallest monthly payment', 'The colour of the advert', 'The total repayment and interest', 'Whether it is popular online'], correct: 2, explanation: 'The total cost shows what you will repay, including interest and possible fees.' }];
let quizIndex = 0; let quizScore = 0; let quizAnswered = false;
function renderQuiz() { const question = quizQuestions[quizIndex]; quizAnswered = false; $('#quizCount').textContent = `Question ${quizIndex + 1} of ${quizQuestions.length}`; $('#quizProgress').style.width = `${((quizIndex + 1) / quizQuestions.length) * 100}%`; $('#questionTopic').textContent = question.topic; $('#questionText').textContent = question.question; $('#quizFeedback').textContent = ''; $('#nextQuestion').disabled = true; $('#nextQuestion').innerHTML = 'Choose an answer <span>→</span>'; $('#answers').innerHTML = question.answers.map((answer, index) => `<button class="answer-option" data-answer="${index}"><span>${String.fromCharCode(65 + index)}</span>${answer}</button>`).join(''); $$('.answer-option').forEach((button) => button.addEventListener('click', () => selectAnswer(Number(button.dataset.answer)))); }
function selectAnswer(answer) { if (quizAnswered) return; quizAnswered = true; const question = quizQuestions[quizIndex]; const buttons = $$('.answer-option'); buttons[question.correct].classList.add('correct'); if (answer === question.correct) { quizScore++; $('#quizFeedback').textContent = `Correct. ${question.explanation}`; } else { buttons[answer].classList.add('wrong'); $('#quizFeedback').textContent = `Not quite. ${question.explanation}`; } $('#nextQuestion').disabled = false; $('#nextQuestion').innerHTML = quizIndex === quizQuestions.length - 1 ? 'See my score <span>→</span>' : 'Next question <span>→</span>'; }
$('#nextQuestion').addEventListener('click', () => { if (!quizAnswered) return; if (quizIndex < quizQuestions.length - 1) { quizIndex++; renderQuiz(); } else { $('#quizCard').innerHTML = `<div class="quiz-result"><div class="score-ring">${quizScore}/${quizQuestions.length}</div><h2>${quizScore >= 4 ? 'You’re building a strong base.' : 'Good start. Keep exploring.'}</h2><p>You got ${quizScore} correct. Every question is a chance to make money feel more familiar.</p><button class="primary-button" id="retakeQuiz">Retake quiz <span>↻</span></button></div>`; $('#retakeQuiz').addEventListener('click', () => { quizIndex = 0; quizScore = 0; $('#quizCard').innerHTML = `<div class="quiz-progress"><i id="quizProgress"></i></div><div class="quiz-content"><span class="question-topic" id="questionTopic"></span><h2 id="questionText"></h2><div class="answers" id="answers"></div><div class="quiz-footer"><span id="quizFeedback"></span><button class="primary-button" id="nextQuestion" disabled></button></div></div>`; $('#nextQuestion').addEventListener('click', () => { if (quizAnswered) { if (quizIndex < quizQuestions.length - 1) { quizIndex++; renderQuiz(); } } }); renderQuiz(); }); } });

updateBudget(); updateGoal(); renderQuiz();
