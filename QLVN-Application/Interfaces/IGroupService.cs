using QLVN_Contracts.Dtos.Group;


namespace QLVN_Application.Interfaces
{
    public interface IGroupService
    {
        Task<IEnumerable<GroupDto>> GetAllAsync();
    }
}
