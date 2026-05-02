(() => {
  const progress = document.querySelector('[data-reading-progress]');
  const progressBar = document.querySelector('[data-reading-progress-bar]');
  const source = document.querySelector('[data-reading-progress-source]');

  if (progress && progressBar && source) {
    let progressFrame = 0;

    const updateProgress = () => {
      progressFrame = 0;
      const rect = source.getBoundingClientRect();
      const total = source.offsetHeight - window.innerHeight;

      if (total <= 0) {
        progress.hidden = true;
        return;
      }

      const current = Math.min(Math.max(-rect.top, 0), total);
      const value = Math.max(0, Math.min(100, (current / total) * 100));

      progress.hidden = false;
      progressBar.style.width = `${value}%`;
    };

    const scheduleProgressUpdate = () => {
      if (progressFrame) {
        return;
      }

      progressFrame = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    document.addEventListener('scroll', scheduleProgressUpdate, { passive: true });
    window.addEventListener('resize', scheduleProgressUpdate, { passive: true });
  }

  document.querySelectorAll('[data-copy-url]').forEach((button) => {
    button.addEventListener('click', async () => {
      const url = button.getAttribute('data-copy-url') || '';
      const defaultLabel = button.getAttribute('data-copy-default') || 'Copy';
      const successLabel = button.getAttribute('data-copy-success') || 'Copied';
      const label = button.querySelector('span:last-child');
      const defaultTitle = button.getAttribute('title') || defaultLabel;

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(url);
        } else {
          window.prompt('Copiaza acest link:', url);
        }

        if (label) {
          label.textContent = successLabel;
        }

        button.setAttribute('title', successLabel);
        window.setTimeout(() => {
          if (label) {
            label.textContent = defaultLabel;
          }

          button.setAttribute('title', defaultTitle);
        }, 1800);
      } catch (error) {
        button.setAttribute('title', defaultTitle);
      }
    });
  });

  document.querySelectorAll('[data-print-page]').forEach((button) => {
    button.addEventListener('click', () => {
      window.print();
    });
  });

  const adStrategy = window.kepoliAdStrategy || {};
  const pushEvent = (event, data = {}) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...data });
  };

  pushEvent('recipe_page_view', {
    mode: adStrategy.mode || 'baseline',
  });

  let scroll50Tracked = false;
  const trackScrollDepth = () => {
    if (scroll50Tracked || !source) {
      return;
    }

    const total = source.offsetHeight - window.innerHeight;
    if (total <= 0) {
      return;
    }

    const current = Math.min(Math.max(-source.getBoundingClientRect().top, 0), total);
    if ((current / total) >= 0.5) {
      scroll50Tracked = true;
      pushEvent('scroll_50', { mode: adStrategy.mode || 'baseline' });
    }
  };

  document.addEventListener('scroll', trackScrollDepth, { passive: true });
  trackScrollDepth();

  const injectAdHtml = (html) => {
    const holder = document.createElement('div');
    holder.innerHTML = html;

    Array.prototype.slice.call(holder.childNodes).forEach((node) => {
      if (node.nodeName && node.nodeName.toLowerCase() === 'script') {
        const script = document.createElement('script');
        Array.prototype.slice.call(node.attributes || []).forEach((attr) => {
          script.setAttribute(attr.name, attr.value);
        });
        if (node.text) {
          script.text = node.text;
        }
        document.head.appendChild(script);
        return;
      }

      (document.body || document.documentElement).appendChild(node.cloneNode(true));
    });
  };

  const canTriggerOnclick = () => {
    if (!adStrategy.onclickHtml || !['medium', 'aggressive'].includes(adStrategy.mode || 'baseline')) {
      return false;
    }

    const now = Date.now();
    const cooldownMinutes = Math.max(30, parseInt(adStrategy.onclickCooldownMinutes || 60, 10));
    const cooldownMs = cooldownMinutes * 60 * 1000;
    const avoidVignetteMs = Math.max(0, parseInt(adStrategy.avoidVignetteMinutes || 0, 10)) * 60 * 1000;

    try {
      const lastOnclick = parseInt(window.localStorage.getItem('kepoli_monetag_onclick_action') || '0', 10);
      const lastVignette = parseInt(window.localStorage.getItem('kepoli_monetag_vignette') || '0', 10);
      if (lastOnclick && now - lastOnclick < cooldownMs) {
        return false;
      }
      if (avoidVignetteMs && lastVignette && now - lastVignette < avoidVignetteMs) {
        return false;
      }
      window.localStorage.setItem('kepoli_monetag_onclick_action', String(now));
    } catch (error) {
      return false;
    }

    return true;
  };

  document.querySelectorAll('[data-ad-intent-action]').forEach((element) => {
    element.addEventListener('click', () => {
      const action = element.getAttribute('data-ad-intent-action') || 'recipe_intent';
      pushEvent(`${action}_click`, { mode: adStrategy.mode || 'baseline' });

      if (!canTriggerOnclick()) {
        return;
      }

      window.setTimeout(() => {
        injectAdHtml(adStrategy.onclickHtml);
        pushEvent('popunder_triggered', { mode: adStrategy.mode || 'baseline', trigger: action });
      }, 900);
    });
  });

  document.querySelectorAll('[data-ad-event]').forEach((element) => {
    element.addEventListener('click', () => {
      pushEvent(element.getAttribute('data-ad-event') || 'ad_event', {
        mode: adStrategy.mode || 'baseline',
      });
    });
  });
})();
