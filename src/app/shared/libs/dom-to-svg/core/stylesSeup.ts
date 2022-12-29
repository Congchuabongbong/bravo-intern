
export const normalStyles: Record<string, string> = {
  backgroundColor: '#ffffff',
  borderBottom: '1px',
  borderRight: '1px',
  lineHeight: 'normal',
  fontFamily: '"Poppins", sans-serif',
  fontWeight: 'normal',
  fontSize: '16px',
};

export const alternateStyles: Record<string, string> = {
  ...normalStyles,
  backgroundColor: '#b7c4cf'
};

export const subtotal0Styles: Record<string, string> = {
  ...normalStyles,
  backgroundColor: '#FFF6BD'
};
export const subtotal1Styles: Record<string, string> = {
  ...normalStyles,
  backgroundColor: '#FBC252'
};


export const frozenStyles: Record<string, string> = {
  ...normalStyles,
  backgroundColor: '#b3ffae'
};

export const fixedStyles: Record<string, string> = {
  ...normalStyles,
  backgroundColor: '#dfe3e8',
  fontWeight: 'bold',
};

export const rowsHeaderStyles: Record<string, string> = {
  ...normalStyles,
  backgroundColor: '#dfe3e8',
};
