using QLVN_Contracts.Dtos.Theme;

namespace QLVN_Blazor.Services
{
    public class ThemeState
    {
        public ThemeSettings Settings { get; private set; } = new ThemeSettings();
        public event Action OnChange;

        public void SetSettings(ThemeSettings settings)
        {
            Settings = settings;
            NotifyStateChanged();
        }

        public void Update(Action<ThemeSettings> action)
        {
            action(Settings);
            NotifyStateChanged();
        }

        private void NotifyStateChanged() => OnChange?.Invoke();
    }
}