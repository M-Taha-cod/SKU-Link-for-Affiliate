        // ================================================================
        //   ⭐ MASTER DATA — EDIT THIS SECTION TO ADD YOUR SKUs ⭐
        // ================================================================
        // This is where you add all your SKUs and their product links.
        // Format: 'SKU-CODE': 'https://product-link.com'
        // ================================================================

        const MASTER_SKU_DATA = {
            // ---------- AMAZON PRODUCTS ----------
            'KIT001': 'https://amzn.to/4wxi3Rp',
            'KIT002': 'https://amzn.to/4pTqaoS',
            'KIT003': '',
            'KIT004': '',
            'KIT005': '',
            'KIT006': '',
            'KIT007': '',
            'KIT008': '',
            'KIT009': '',
            'KIT010': '',
            'KIT011': '',
            'KIT012': '',
            'KIT013': '',
            'KIT014': '',
            'KIT015': '',
            'KIT016': '',
           




            

            // ============================================================
            //  ⬇️  ADD YOUR SKUs BELOW THIS LINE  ⬇️
            // ============================================================
            // 'YOUR-SKU-HERE': 'https://your-product-link.com',
            // 'PHONE-12': 'https://www.amazon.com/dp/B0ABCDEFGH',
            // 'LAPTOP-99': 'https://www.bestbuy.com/product/12345',
        };

        // ================================================================
        //   CONFIG - NO NEED TO EDIT BELOW THIS LINE
        // ================================================================

        const STORAGE_KEY = 'skuLinks_userData';

        // ================================================================
        //   DATA LAYER
        // ================================================================

        // Get master data (read-only)
        function getMasterData() {
            return { ...MASTER_SKU_DATA };
        }

        // Get user data from localStorage (for future use)
        function getUserData() {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                try {
                    return JSON.parse(stored);
                } catch {
                    return {};
                }
            }
            return {};
        }

        // Get combined data (master + user) — user overrides master if same SKU
        function getCombinedData() {
            const master = getMasterData();
            const user = getUserData();
            return { ...master, ...user };
        }

        // ================================================================
        //   DOM REFS
        // ================================================================

        const skuInput = document.getElementById('skuInput');
        const searchBtn = document.getElementById('searchBtn');
        const resultCard = document.getElementById('resultCard');
        const resultLink = document.getElementById('resultLink');
        const copyBtn = document.getElementById('copyBtn');
        const notFound = document.getElementById('notFound');
        const skuCount = document.getElementById('skuCount');

        // ================================================================
        //   UPDATE SKU COUNT
        // ================================================================

        function updateSkuCount() {
            const data = getCombinedData();
            const count = Object.keys(data).length;
            skuCount.textContent = `📦 ${count} SKUs available`;
        }

        // ================================================================
        //   SEARCH LOGIC
        // ================================================================

        function lookupSku(sku) {
            const trimmed = sku.trim();
            if (!trimmed) {
                resultCard.classList.remove('visible');
                notFound.classList.remove('visible');
                return;
            }

            const data = getCombinedData();
            const link = data[trimmed];

            if (link) {
                resultLink.href = link;
                resultLink.textContent = link;
                resultCard.classList.add('visible');
                notFound.classList.remove('visible');
                copyBtn.textContent = '📋 Copy';
                copyBtn.classList.remove('copied');
            } else {
                resultCard.classList.remove('visible');
                notFound.classList.add('visible');
            }
        }

        // ================================================================
        //   COPY LINK
        // ================================================================

        async function copyLink() {
            const link = resultLink.textContent;
            if (!link || link === '—') return;

            try {
                await navigator.clipboard.writeText(link);
                copyBtn.textContent = '✅ Copied!';
                copyBtn.classList.add('copied');
                setTimeout(() => {
                    copyBtn.textContent = '📋 Copy';
                    copyBtn.classList.remove('copied');
                }, 2000);
            } catch {
                // Fallback for older browsers
                const temp = document.createElement('input');
                temp.value = link;
                document.body.appendChild(temp);
                temp.select();
                document.execCommand('copy');
                temp.remove();
                copyBtn.textContent = '✅ Copied!';
                copyBtn.classList.add('copied');
                setTimeout(() => {
                    copyBtn.textContent = '📋 Copy';
                    copyBtn.classList.remove('copied');
                }, 2000);
            }
        }

        // ================================================================
        //   EVENT BINDINGS
        // ================================================================

        searchBtn.addEventListener('click', () => lookupSku(skuInput.value));

        skuInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                lookupSku(skuInput.value);
            }
        });

        copyBtn.addEventListener('click', copyLink);

        // ================================================================
        //   KEYBOARD SHORTCUTS
        // ================================================================

        // Ctrl+K or Cmd+K to focus search
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                skuInput.focus();
                skuInput.select();
            }
            // Escape to clear search and results
            if (e.key === 'Escape') {
                skuInput.value = '';
                resultCard.classList.remove('visible');
                notFound.classList.remove('visible');
                skuInput.focus();
            }
        });

        // ================================================================
        //   INIT
        // ================================================================

        updateSkuCount();

        // Auto-search from URL param (e.g. ?sku=AMZ-442)
        const urlParams = new URLSearchParams(window.location.search);
        const skuParam = urlParams.get('sku');
        if (skuParam) {
            skuInput.value = skuParam;
            lookupSku(skuParam);
        }

        console.log('🔗 SKU Link Finder ready!');
        console.log(`📦 ${Object.keys(getCombinedData()).length} SKUs loaded`);
        console.log('⭐ To add SKUs, edit MASTER_SKU_DATA in the JavaScript');
        console.log('⌨️  Shortcuts: Ctrl+K to search, Escape to clear');