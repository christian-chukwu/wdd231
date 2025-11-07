// Directory page functionality
document.addEventListener('DOMContentLoaded', () => {
  const gridViewBtn = document.getElementById('grid-view');
  const listViewBtn = document.getElementById('list-view');
  const membersContainer = document.getElementById('members-container');

  // View toggle functionality
  gridViewBtn.addEventListener('click', () => {
    membersContainer.className = 'grid-view';
  });

  listViewBtn.addEventListener('click', () => {
    membersContainer.className = 'list-view';
  });

  // Fetch and display members
  async function loadMembers() {
    try {
      const response = await fetch('data/members.json');
      const data = await response.json();
      displayMembers(data.members);
    } catch (error) {
      console.error('Error loading members:', error);
      membersContainer.innerHTML = '<p>Error loading members. Please try again later.</p>';
    }
  }

  function displayMembers(members) {
    membersContainer.innerHTML = '';

    members.forEach(member => {
      const memberCard = document.createElement('div');
      memberCard.className = 'member-card';

      const membershipBadge = getMembershipBadge(member.membershipLevel);

      memberCard.innerHTML = `
        <img src="images/${member.image}" alt="${member.name}" class="member-image">
        <div class="member-info">
          <h3>${member.name} ${membershipBadge}</h3>
          <p>${member.description}</p>
          <p>📍 ${member.address}</p>
          <p>📞 ${member.phone}</p>
          <p><a href="${member.website}" target="_blank">Visit Website</a></p>
        </div>
      `;

      membersContainer.appendChild(memberCard);
    });
  }

  function getMembershipBadge(level) {
    const badges = {
      1: { emoji: '🥉', label: 'Bronze', className: 'membership-bronze' },
      2: { emoji: '🥈', label: 'Silver', className: 'membership-silver' },
      3: { emoji: '🥇', label: 'Gold', className: 'membership-gold' }
    };

    const b = badges[level] || null;
    if (!b) return '';
    return `<span class="membership-badge ${b.className}">${b.emoji} ${b.label}</span>`;
  }

  // Initial load
  loadMembers();
});