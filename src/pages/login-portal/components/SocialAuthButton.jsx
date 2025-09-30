// import React from 'react';
// import Button from '../../../components/ui/Button';
// import Icon from '../../../components/AppIcon';

// const SocialAuthButton = ({ provider, onClick, loading, disabled }) => {
//   const getProviderConfig = (provider) => {
//     const configs = {
//       google: {
//         name: 'Google',
//         icon: 'Chrome',
//         bgColor: 'bg-white hover:bg-gray-50',
//         textColor: 'text-gray-700',
//         borderColor: 'border-gray-300'
//       },
//       microsoft: {
//         name: 'Microsoft',
//         icon: 'Square',
//         bgColor: 'bg-blue-600 hover:bg-blue-700',
//         textColor: 'text-white',
//         borderColor: 'border-blue-600'
//       },
//       linkedin: {
//         name: 'LinkedIn',
//         icon: 'Linkedin',
//         bgColor: 'bg-blue-700 hover:bg-blue-800',
//         textColor: 'text-white',
//         borderColor: 'border-blue-700'
//       }
//     };
//     return configs?.[provider] || configs?.google;
//   };

//   const config = getProviderConfig(provider);

//   return (
//     <Button
//       variant="outline"
//       fullWidth
//       onClick={onClick}
//       loading={loading}
//       disabled={disabled}
//       className={`${config?.bgColor} ${config?.textColor} ${config?.borderColor} transition-all duration-300 hover:scale-105 hover:shadow-medium`}
//     >
//       <div className="flex items-center justify-center space-x-3">
//         <Icon name={config?.icon} size={18} />
//         <span className="font-medium">Continue with {config?.name}</span>
//       </div>
//     </Button>
//   );
// };

// export default SocialAuthButton;

import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SocialAuthButton = ({ onClick, loading, disabled }) => {
  return (
    <Button
      variant="outline"
      fullWidth
      onClick={onClick}
      loading={loading}
      disabled={disabled}
      className="bg-white hover:bg-gray-50 text-gray-700 border-gray-300 transition-all duration-300 hover:shadow-medium"
      aria-label="Sign in with Google"
    >
      <div className="flex items-center justify-center space-x-3">
        <Icon name="Chrome" size={18} />
        <span className="font-medium">Continue with Google</span>
      </div>
    </Button>
  );
};

export default SocialAuthButton;