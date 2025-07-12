function highlight(text, pattern, start, matched) {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      if (i >= start && i < start + pattern.length) {
        result += `<span class="${matched ? 'match' : 'mismatch'}">${text[i]}</span>`;
      } else {
        result += text[i];
      }
    }
    return result;
  }
  
  function runKMP() {
    const text = document.getElementById("text").value;
    const pattern = document.getElementById("pattern").value;
    const output = document.getElementById("kmp-output");
  
    if (!text || !pattern) {
      output.innerHTML = "❌ Please enter both text and pattern.";
      return;
    }
  
    const lps = Array(pattern.length).fill(0);
    let len = 0, i = 1;
    while (i < pattern.length) {
      if (pattern[i] === pattern[len]) {
        lps[i++] = ++len;
      } else if (len !== 0) {
        len = lps[len - 1];
      } else {
        lps[i++] = 0;
      }
    }
  
    let res = `LPS Array: [${lps.join(', ')}]\n\n`;
    i = 0; let j = 0;
    while (i < text.length) {
      res += `Comparing "${text[i]}" with "${pattern[j]}"\n`;
      if (pattern[j] === text[i]) {
        i++; j++;
      }
  
      if (j === pattern.length) {
        res += `✅ Match found at index ${i - j}\n\n`;
        res += highlight(text, pattern, i - j, true) + '\n\n';
        j = lps[j - 1];
      } else if (i < text.length && pattern[j] !== text[i]) {
        res += `❌ Mismatch\n`;
        res += highlight(text, pattern, i - j, false) + '\n\n';
        j = j !== 0 ? lps[j - 1] : 0;
        if (j === 0) i++;
      }
    }
  
    output.innerHTML = res;
  }
  
  function runRabinKarp() {
    const text = document.getElementById("text").value;
    const pattern = document.getElementById("pattern").value;
    const output = document.getElementById("rk-output");
  
    if (!text || !pattern) {
      output.innerHTML = "❌ Please enter both text and pattern.";
      return;
    }
  
    const d = 256;
    const q = 101;
    const M = pattern.length;
    const N = text.length;
    let p = 0, t = 0, h = 1;
    let result = "";
  
    for (let i = 0; i < M - 1; i++) h = (h * d) % q;
    for (let i = 0; i < M; i++) {
      p = (d * p + pattern.charCodeAt(i)) % q;
      t = (d * t + text.charCodeAt(i)) % q;
    }
  
    for (let i = 0; i <= N - M; i++) {
      result += `Hash Compare at ${i}: ${p} vs ${t}\n`;
  
      if (p === t) {
        let match = true;
        for (let j = 0; j < M; j++) {
          if (text[i + j] !== pattern[j]) {
            match = false;
            break;
          }
        }
        if (match) {
          result += `✅ Match found at index ${i}\n`;
          result += highlight(text, pattern, i, true) + '\n\n';
        } else {
          result += `⚠️ False positive at index ${i}\n`;
          result += highlight(text, pattern, i, false) + '\n\n';
        }
      }
  
      if (i < N - M) {
        t = (d * (t - text.charCodeAt(i) * h) + text.charCodeAt(i + M)) % q;
        if (t < 0) t = t + q;
      }
    }
  
    output.innerHTML = result;
  }
  
  function clearOutput() {
    document.getElementById("kmp-output").innerText = "⏳ Waiting for input...";
    document.getElementById("rk-output").innerText = "⏳ Waiting for input...";
  }
