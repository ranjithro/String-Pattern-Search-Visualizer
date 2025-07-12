#include <iostream>
#include <vector>
using namespace std;

// KMP Algorithm
void KMPSearch(string pat, string txt) {
    int M = pat.length(), N = txt.length();
    vector<int> lps(M, 0);
    int len = 0, i = 1;

    while (i < M) {
        if (pat[i] == pat[len]) lps[i++] = ++len;
        else if (len != 0) len = lps[len - 1];
        else lps[i++] = 0;
    }

    i = 0; int j = 0;
    while (i < N) {
        if (pat[j] == txt[i]) { j++; i++; }
        if (j == M) {
            cout << "Pattern found at index " << i - j << endl;
            j = lps[j - 1];
        } else if (i < N && pat[j] != txt[i]) {
            j = (j != 0) ? lps[j - 1] : 0, i += (j == 0);
        }
    }
}

// Rabin-Karp Algorithm
void RabinKarp(string pat, string txt, int q = 101) {
    int d = 256, M = pat.length(), N = txt.length();
    int p = 0, t = 0, h = 1;

    for (int i = 0; i < M - 1; i++) h = (h * d) % q;
    for (int i = 0; i < M; i++) {
        p = (d * p + pat[i]) % q;
        t = (d * t + txt[i]) % q;
    }

    for (int i = 0; i <= N - M; i++) {
        if (p == t) {
            bool match = true;
            for (int j = 0; j < M; j++) {
                if (txt[i + j] != pat[j]) { match = false; break; }
            }
            if (match) cout << "Pattern found at index " << i << endl;
        }
        if (i < N - M) {
            t = (d * (t - txt[i] * h) + txt[i + M]) % q;
            if (t < 0) t += q;
        }
    }
}

int main() {
    string text = "ababcabcabababd";
    string pattern = "ababd";

    cout << "KMP Search:\n";
    KMPSearch(pattern, text);

    cout << "\nRabin-Karp Search:\n";
    RabinKarp(pattern, text);

    return 0;
}
