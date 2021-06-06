using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CarDealership.Models.Students
{
    public partial class Subject
    {
        public Subject()
        {
            Groups = new HashSet<Group>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string UserName { get; set; }
        public int? FinalType { get; set; }

        public virtual ICollection<Group> Groups { get; set; }
    }
}
