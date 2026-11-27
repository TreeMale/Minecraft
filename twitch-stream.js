const streamStatus = document.getElementById('stream-status');
const streamPlayer = document.getElementById('twitch-player');
const streamViewport = window.matchMedia('(min-width: 540px)');

function setStreamStatus(state, label) {
    streamStatus.dataset.state = state;
    streamStatus.textContent = label;
}

function loadStreamPlayer() {
    if (!streamViewport.matches || !location.hostname) return;
    streamViewport.removeEventListener('change', loadStreamPlayer);
    setStreamStatus('unknown', 'Проверяем статус эфира…');
    const timeout = setTimeout(() => setStreamStatus('unknown', 'Статус эфира — на Twitch'), 12000);
    const script = document.createElement('script');
    script.src = 'https://player.twitch.tv/js/embed/v1.js';
    script.addEventListener('error', () => {
        clearTimeout(timeout);
        setStreamStatus('unknown', 'Статус эфира — на Twitch');
    });
    script.addEventListener('load', () => {
        if (!window.Twitch?.Player) return;
        streamPlayer.hidden = false;
        const TwitchPlayer = window.Twitch.Player;
        const player = new TwitchPlayer(streamPlayer.id, {
            channel: 'treemale',
            width: '100%',
            height: '100%',
            parent: [location.hostname],
            autoplay: false
        });
        const update = (state, label) => {
            clearTimeout(timeout);
            setStreamStatus(state, label);
        };
        player.addEventListener(TwitchPlayer.ONLINE, () => update('live', 'В прямом эфире'));
        player.addEventListener(TwitchPlayer.OFFLINE, () => update('offline', 'Сейчас не в эфире'));
    });
    document.head.appendChild(script);
}

streamViewport.addEventListener('change', loadStreamPlayer);
loadStreamPlayer();
