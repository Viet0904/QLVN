

using QLVN_Contracts.Dtos.Theme;

namespace QLVN_Application.Interfaces
{
    public interface IThemeService
    {
        Task <string> GetThemeAsync();
        Task <string> SaveThemeAsync();
    }
}
