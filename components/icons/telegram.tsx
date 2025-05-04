export const TelegramIcon: React.FC<any> = ({
    size = 24,
    width,
    height,
    ...props
  }) => {
    return (
      <svg
        height={size || height}
        viewBox="0 0 24 24"
        width={size || width}
        {...props}
      >
        <path
          d="M20.665 3.717l-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42l10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701l-.314 4.692c.46 0 .663-.211.921-.46l2.211-2.15l4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.433z"
          fill="currentColor"
        />
      </svg>
    );
  };
