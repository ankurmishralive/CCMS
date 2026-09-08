import RolePage from '../RolePage';

function Customer() {
	return <RolePage eyebrow="Customer portal" title="Your voice deserves a clear answer." description="Follow your complaint, see the latest update, and stay connected with the people working on your resolution." accent="purple" stats={[{ value: '02', label: 'open requests' }, { value: '01', label: 'latest update' }, { value: '24h', label: 'next response' }]} />;
}

export default Customer;
