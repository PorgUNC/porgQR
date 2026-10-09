{
  description = "Tauri Development Environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };

        libraries = with pkgs; [
          webkitgtk_4_1
          gtk3
          cairo
          gdk-pixbuf
          glib
          dbus
          openssl_3_5
          librsvg
          xdg-desktop-portal
          pango
          harfbuzz
          atk
          libsoup_3
          zlib
        ];
      in
      {
        devShells.default = (pkgs.buildFHSEnv {
          name = "tauri-env";

          targetPkgs = pkgs: with pkgs; [
            pkg-config
            gobject-introspection
            cargo
            rustc
            cargo-tauri
            nodejs
            xdg-utils
            file
            gsettings-desktop-schemas
            pango.dev
            cairo.dev
            glib.dev
            gtk3.dev
            webkitgtk_4_1.dev
            harfbuzz.dev
            atk.dev
            openssl_3_5.dev
            gdk-pixbuf.dev
            libsoup_3.dev
            zlib.dev
            dbus.dev
          ] ++ libraries;

          profile = ''
            export WEBKIT_DISABLE_DMABUF_RENDERER="1"

            # Map FHS directories to ensure cargo-sys libraries find everything
            export PKG_CONFIG_PATH="/usr/lib/pkgconfig:/usr/share/pkgconfig:$PKG_CONFIG_PATH"
            export LD_LIBRARY_PATH="/usr/lib:/usr/lib64:${pkgs.lib.makeLibraryPath libraries}:$LD_LIBRARY_PATH"
            export XDG_DATA_DIRS="${pkgs.gsettings-desktop-schemas}/share:$XDG_DATA_DIRS"
          '';
        }).env;
      });
}
