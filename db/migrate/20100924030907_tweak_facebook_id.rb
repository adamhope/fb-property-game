class TweakFacebookId < ActiveRecord::Migration
  def self.up
    change_column :users, :facebook_id, :decimal, :precision => 20
    add_index :users, [ :facebook_id ], :name => :user_facebook_id_uidx, :unique => true
  end

  def self.down
    remove_index :users, :user_facebook_id_uidx
  end
end
